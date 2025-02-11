// Import necessary packages
const { createClient } = require('@supabase/supabase-js');
const { PromptTemplate } = require('@langchain/core/prompts');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Supabase and Gemini API clients
const supabaseClient = createClient(process.env.SUPABASE_URL_LC_CHATBOT, process.env.SUPABASE_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

// Define the prompt template for standalone question generation
const standaloneQuestionTemplate = "Given a question convert it to a standalone question: {question} standalone question:";
const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate);

/**
 * Generates a standalone version of the question.B 
 * @param {string} question - The user question.
 * @returns {Promise<string>} - A standalone version of the question.
 */
async function generateStandaloneQuestion(question) {
    try {
        const promptText = await standaloneQuestionPrompt.format({ question });
        console.log("Question to be sent to AI model:", promptText);
        const result = await model.generateContent(promptText);
        return result.response.text() || 'No response';
    } catch (error) {
        console.error("Error generating standalone question:", error);
        return null;
    }
}

/**
 * Generates embeddings for a given text using the Gemini model.
 * @param {string} text - The text to embed.
 * @returns {Promise<Array<number>>} - Embedding values as an array of numbers.
 */
async function generateEmbedding(text) {
    try {
        const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const result = await embeddingModel.embedContent(text);
        return result.embedding.values;
    } catch (error) {
        console.error("Error generating embedding:", error);
        return null;
    }
}

/**
 * Retrieves the context from the database based on embeddings.
 * @param {Array<number>} embedding - The embedding vector to match against.
 * @returns {Promise<string>} - The matched context as a single string.
 */
async function retrieveMatches(embedding) {
    try {
        console.log("Query Embedding:", embedding);

        const { data, error } = await supabaseClient.rpc('match_documents', {
            query_embedding: embedding,
            filter: {},
            match_count: 10
        });

        if (error) {
            console.error("Error retrieving matches:", error);
            return '';
        }

        console.log("Matched Data:", data);
        return data.map(chunk => chunk.content).join(" ");
    } catch (error) {
        console.error("Error retrieving matches:", error);
        return '';
    }
}

/**
 * Generates the final response for the chatbot using the Gemini model.
 * @param {string} context - Context retrieved from embeddings.
 * @param {string} standaloneQuestion - The standalone question.
 * @returns {Promise<string>} - A chat response for the given question.
 */
async function generateChatResponse(context, standaloneQuestion) {
    try {
        const masterPrompt = `
        The following information is provided for educational purposes on public health and wellness.
        Context: ${context}
        Question: ${standaloneQuestion}
        Please provide a concise, professional response focused on educational guidance for reproductive health.
        The tone should be informative and respectful, and aim to empower individuals with safe and healthy practices.`;

        const result = await model.generateContent(masterPrompt);
        return result.response.text() || 'No response';
    } catch (error) {
        console.error("Error generating chat response:", error);
        return null;
    }
}

module.exports = {
    generateStandaloneQuestion,
    generateEmbedding,
    retrieveMatches,
    generateChatResponse
};
