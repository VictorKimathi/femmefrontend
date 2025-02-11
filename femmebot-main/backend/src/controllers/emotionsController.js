const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const { PromptTemplate } = require('@langchain/core/prompts');

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

const emotionAdviceTemplate = `
You are an emotional counselor. Analyze the combination of emotions and provide comprehensive advice. 
Combine insights from all emotions: {emotions}.

Respond strictly in this JSON format:

{{
  "diet": "Food/drink recommendations combining all emotions",
  "behavior": "Activities/behaviors addressing the emotional mix",
  "exercise": "Physical activities balancing these emotions",
  "coping": "Mental strategies for this combination",
  "issues": "Potential concerns with this emotional mix"
}}

Response:
`;

const EmotionAdvicePrompt = PromptTemplate.fromTemplate(emotionAdviceTemplate);

async function getEmotionAdvice(emotions) {
    try {
        if (!Array.isArray(emotions) || emotions.length === 0) {
            throw new Error("Emotions array is required");
        }
        
        const emotionString = emotions.join('').toLowerCase();
        const promptText = await EmotionAdvicePrompt.format({ emotions: emotionString });
        
        const result = await model.generateContent(promptText);
        if (!result?.response?.text) throw new Error("AI response failed");
        
        const responseText = result.response.text();
        const cleanedResponse = responseText.replace(/```json/g, '').replace(/```/g, '');
        
        return JSON.parse(cleanedResponse);
    } catch (error) {
        console.error("Error generating advice:", error);
        throw new Error(`Advice generation failed: ${error.message}`);
    }
}

module.exports = { getEmotionAdvice };