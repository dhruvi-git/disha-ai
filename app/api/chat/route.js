import { convertToModelMessages, createIdGenerator, streamText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma';
import { makeTitle, textFromParts } from '@/lib/chat-store';

// Initialize the Groq provider with your API key
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export const maxDuration = 60;

const MAX_HISTORY = 12; // messages sent to the model per request

const generateMessageId = createIdGenerator({ prefix: 'msg', size: 16 });

// Turn a stored/UI message into a text-only message the model can read,
// inlining the text of any attached files into user messages.
function toModelReadyMessage(message) {
  const text = textFromParts(message.parts);
  const attachments = message.metadata?.attachments || [];

  if (message.role !== 'user' || attachments.length === 0) {
    return { role: message.role, parts: [{ type: 'text', text: text || ' ' }] };
  }

  const files = attachments
    .map(
      (a) =>
        `<attached_file name="${a.name}"${a.truncated ? ' note="truncated"' : ''}>\n${a.text}\n</attached_file>`
    )
    .join('\n\n');

  return {
    role: 'user',
    parts: [
      {
        type: 'text',
        text: `${files}\n\n${text || 'Please review the attached file(s) and give me your feedback.'}`,
      },
    ],
  };
}

async function saveUserMessage(conversationId, userId, message) {
  const existing = await db.conversation.findUnique({ where: { id: conversationId } });

  if (existing && existing.userId !== userId) return false;

  if (!existing) {
    await db.conversation.create({
      data: { id: conversationId, userId, title: makeTitle(message) },
    });
  }

  await db.chatMessage.upsert({
    where: { id: message.id },
    update: {},
    create: {
      id: message.id,
      conversationId,
      role: 'user',
      parts: message.parts ?? [],
      metadata: message.metadata ?? undefined,
    },
  });
  return true;
}

export async function POST(req) {
  try {
    const { id: conversationId, messages = [] } = await req.json();
    const user = await currentUser();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // 1. RETRIEVAL: Fetch the user's specific data from your database
    // Updated to match 'clerkUserId' exactly as defined in your schema
    const userProfile = await db.user.findUnique({
      where: { clerkUserId: user.id },
      include: {
        resume: true, 
        // Grab the 3 most recent assessments for context without overloading the prompt
        assessments: {
            orderBy: { createdAt: 'desc' },
            take: 3 
        }, 
      }
    });

    // Extract skills safely
    const userSkills = userProfile?.skills?.length 
        ? userProfile.skills.join(', ') 
        : "No skills listed yet.";

    // Extract assessment context safely
    const assessmentContext = userProfile?.assessments?.length
        ? userProfile.assessments.map(a => `${a.category} Score: ${a.quizScore}%`).join(' | ')
        : "No assessments taken yet.";

    // Persist the newest user message (and create the conversation on first send).
    const lastMessage = messages[messages.length - 1];
    const shouldPersist = Boolean(conversationId && userProfile && lastMessage?.role === 'user');
    if (shouldPersist) {
      const allowed = await saveUserMessage(conversationId, userProfile.id, lastMessage);
      if (!allowed) return new Response("Forbidden", { status: 403 });
    }

    const modelMessages = await convertToModelMessages(
      messages.slice(-MAX_HISTORY).map(toModelReadyMessage)
    );

    // 2. AUGMENTATION: Build the highly personalized system prompt
    // Updated to reference your specific schema fields (like resume.content instead of summary)
    const systemPrompt = `
      You are Disha AI, a highly empathetic and expert career coach. 
      You are speaking directly to ${user.firstName || "the user"}.
      
      Here is their private career context straight from their profile:
      - Industry: ${userProfile?.industry || "Unknown"}
      - Experience Level: ${userProfile?.experience ? `${userProfile.experience} years` : "Unknown"}
      - Core Skills: ${userSkills}
      - Recent Assessment Scores: ${assessmentContext}
      
      Current Resume Content (Markdown): 
      ${userProfile?.resume?.content ? userProfile.resume.content.substring(0, 1500) + '...' : "No resume built yet."}
      
      Rules for your responses:
      - Always tailor your advice specifically to the skills, industry, and experience provided above.
      - If they ask for a roadmap, cater it strictly to their current skills and industry.
      - If they ask about changing careers, reference their current industry.
      - Be conversational, concise, professional, and highly actionable.
      - Never say "based on the database" or "based on your context". Just speak naturally.

      Formatting rules (your reply is rendered as Markdown):
      - Use short paragraphs and leave a blank line between paragraphs, headings, lists and tables.
      - Use "###" headings to split longer answers (like roadmaps) into clear sections.
      - Use bullet or numbered lists for steps and action items; keep each bullet to one or two lines.
      - Use a Markdown table only for genuinely tabular data (comparisons, week-by-week plans). Keep tables to at most 4 columns with short cell text; put longer detail in bullets below the table instead.
      - Never put HTML tags such as <br> inside table cells or anywhere else.
      - Bold only key terms, not whole sentences.

      Attached files:
      - The user may attach files (resumes, job descriptions, notes). Their text appears inside <attached_file> tags in the user's message.
      - Read them carefully and refer to specifics from them. Never claim you cannot see or open attachments when that text is present.
    `;

    // 3. GENERATION: Stream the response back to the client using Groq
    const result = streamText({
      model: groq('openai/gpt-oss-20b'), // Groq gpt-oss-20b (Llama 3.1 8B retired Aug 2026)
      system: systemPrompt,
      messages: modelMessages,
    });

    // Keep generating (and saving) even if the user navigates away mid-reply.
    result.consumeStream();

    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      generateMessageId,
      sendReasoning: false,
      onFinish: async ({ responseMessage }) => {
        if (!shouldPersist) return;
        const parts = (responseMessage.parts || []).filter((p) => p.type === 'text');
        if (!textFromParts(parts)) return;
        try {
          await db.chatMessage.upsert({
            where: { id: responseMessage.id },
            update: { parts },
            create: {
              id: responseMessage.id,
              conversationId,
              role: 'assistant',
              parts,
            },
          });
          await db.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() },
          });
        } catch (err) {
          console.error("Failed to save assistant message:", err);
        }
      },
    });
    
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}