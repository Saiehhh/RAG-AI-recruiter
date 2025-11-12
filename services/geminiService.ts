import { GoogleGenAI } from "@google/genai";
import { Profile } from '../types';

export async function generateProfileSummary(query: string, profiles: Profile[]): Promise<string> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-2.5-flash';

  const profilesContext = profiles.map(p => ({
    name: p.name,
    title: p.title,
    experience: `${p.experienceYears} years`,
    skills: p.skills,
    summary: p.bio
  }));

  const prompt = `
    You are a helpful and creative coding assistant for "AI recruiter". Your goal is to analyze a user's query and a list of candidate profiles to find the best creative and technical matches.

    User Query: "${query}"

    Candidate Profiles:
    \`\`\`json
    ${JSON.stringify(profilesContext, null, 2)}
    \`\`\`

    Based on the provided profiles, please do the following:
    1.  Write a summary explaining which candidates best match the user's query.
    2.  Focus on both technical skills and hints of creativity or passion in their bios.
    3.  Structure your response using Markdown for clear, clean formatting (headings, bold text, lists).
    4.  Adopt a calm, encouraging, and professional tone.
    5.  Start with a clear heading like "### Profile Analysis".
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a response from the AI model.");
  }
}