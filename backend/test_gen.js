require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

async function test() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `Suggest 1 recipe. Respond ONLY with a valid JSON array of objects. Each object must have these exact keys:
"name", "region", "ingredients", "tags", "score".`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    console.log(response.text);
  } catch (error) {
    console.error('Test Error:', error.message);
  }
}
test();
