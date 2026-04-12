import { convertToModelMessages, streamText } from 'ai';
import { createGroq } from '@ai-sdk/groq'; 
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/prisma'; // Adjust based on your db import

// Initialize the Groq provider with your API key
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
  try {
    const { messages = [] } = await req.json();
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

    const modelMessages = await convertToModelMessages(messages);

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
    `;

    // 3. GENERATION: Stream the response back to the client using Groq
    const result = streamText({
      model: groq('llama-3.1-8b-instant'), // Groq's lightning-fast Llama 3.1 model
      system: systemPrompt,
      messages: modelMessages,
    });

    return result.toUIMessageStreamResponse();
    
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}