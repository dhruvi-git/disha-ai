"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Groq } from "groq-sdk";
import { revalidatePath } from "next/cache";
import pdfParse from "pdf-parse/lib/pdf-parse.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function saveResume(content) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const resume = await db.resume.upsert({
      where: {
        userId: user.id,
      },
      update: {
        content,
      },
      create: {
        userId: user.id,
        content,
      },
    });

    revalidatePath("/resume");
    return resume;
  } catch (error) {
    console.error("Error saving resume:", error);
    throw new Error("Failed to save resume");
  }
}

export async function getResume() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.resume.findUnique({
    where: {
      userId: user.id,
    },
  });
}

export async function improveWithAI({ current, type }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
    Make it more impactful, quantifiable, and aligned with industry standards.
    Current content: "${current}"

    Requirements:
    1. Use action verbs
    2. Include metrics and results where possible
    3. Highlight relevant technical skills
    4. Keep it concise but detailed
    5. Focus on achievements over responsibilities
    6. Use industry-specific keywords
    
    Format the response as a single paragraph without any additional text or explanations.
  `;

  try {
    const result = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    });
    
    const improvedContent = result.choices[0].message.content.trim();
    return improvedContent;
  } catch (error) {
    console.error("Error improving content:", error);
    throw new Error("Failed to improve content");
  }
}

export async function tailorResumeWithAI(formData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  
  const file = formData.get("file");
  const jobDescription = formData.get("jobDescription");
  
  if (!file || !jobDescription) {
    throw new Error("Missing file or job description");
  }

  let resumeText = "";
  try {
    if (file.type === "application/pdf") {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      const data = await pdfParse(buffer);
      resumeText = data.text;
    } else {
      resumeText = await file.text();
    }
  } catch (err) {
    console.error("File parsing error:", err);
    throw new Error(`Failed to parse the uploaded file: ${err.message}`);
  }

  const prompt = `
    You are an expert ATS resume reviewer and career coach. Review the provided resume against the given Job Description.
    Output a strictly valid JSON object with the following structure:
    {
      "atsScore": (number from 0 to 100 representing how well the resume matches the JD),
      "feedback": (array of 3-5 string tips detailing what exact keywords or experiences are missing or could be phrased better based on the JD),
      "optimizedContent": (the entire rewritten resume formatted in clean Markdown, optimizing the content to better match the exact requirements of the JD. Please ensure you keep the user's essential contact info, modify bullet points to add impactful metrics, and rewrite the professional summary, matching the tone and keywords of the JD.)
    }

    Job Description:
    ${jobDescription}

    Resume:
    ${resumeText}
  `;

  try {
    const result = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });
    
    return JSON.parse(result.choices[0].message.content);
  } catch (error) {
    console.error("Error tailoring resume:", error);
    throw new Error("Failed to tailor resume with AI");
  }
}

