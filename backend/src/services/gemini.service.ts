import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const analyzeIncidentWithGemini = async (title: string, description: string, category: string) => {
  if (!process.env.GEMINI_API_KEY) {
    return { priority: 'Medium', rationale: 'Gemini API key not configured. Defaulting to Medium.' };
  }

  const prompt = `
    Analyze the following Borno State Smart City incident report and return a JSON object with recommended priority (Critical, High, Medium, Low) and suggested department.
    Title: "${title}"
    Category: "${category}"
    Description: "${description}"
  `;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text() || '{}');
  } catch (error) {
    console.error('Gemini Triage Error:', error);
    return { priority: 'Medium', error: 'AI Triage unavailable' };
  }
};