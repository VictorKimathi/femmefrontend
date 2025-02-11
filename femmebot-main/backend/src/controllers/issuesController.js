// controllers/issuesController.js

const { createClient } = require('@supabase/supabase-js');
const { PromptTemplate } = require('@langchain/core/prompts');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const supabaseClient = createClient(process.env.SUPABASE_URL_LC_CHATBOT, process.env.SUPABASE_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

const standaloneQuestionTemplate = "Given a question convert it to a standalone question: {question} standalone question: ";
const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate);

async function generateStandaloneQuestion(question) {
    const promptText = await standaloneQuestionPrompt.format({ question });
    const result = await model.generateContent(promptText);
    return result.response.text() || 'No response';
}

async function generateEmbedding(text) {
    try {
        const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const result = await embeddingModel.embedContent(text);
        return result.embedding.values;
    } catch (err) {
        console.error("Error generating embedding:", err);
        return null;
    }
}

async function retrieveMatches(embedding) {
    const { data, error } = await supabaseClient.rpc('match_documents', {
        query_embedding: embedding,
        filter: {},
        match_count: 10
    });

    if (error) {
        console.error("Error retrieving matches:", error);
        return "";
    }
    return data.map(chunk => chunk.content).join(" ");
}

async function generateChatResponse(context, masterStandaloneQuestion) {
    const masterPrompt = `
    The following information is provided for educational purposes on public health and wellness. 
    Context: ${context}
    Question: ${masterStandaloneQuestion}
    Please provide a concise, professional response focused on educational guidance for reproductive health.
    The tone should be informative and respectful, and aim to empower individuals with safe and healthy practices.`;

    const result = await model.generateContent(masterPrompt);
    return result.response.text() || 'No response';
}

module.exports = class IssuesController {
    static async createIssue(req, res) {
        try {
            console.log("Received POST request to /issues/create");
            console.log("Request body:", req.body);

            const { question, senderId } = req.body;
            if (!question || !senderId) {
                console.log("Missing required fields: question or senderId.");
                return res.status(400).json({ error: 'Question and senderId are required.' });
            }

            // Generate standalone question
            console.log("Generating standalone question...");
            const standaloneQuestion = await generateStandaloneQuestion(question);
            console.log("Standalone question generated:", standaloneQuestion);

            if (!standaloneQuestion) {
                console.log("Error: Standalone question generation failed.");
                return res.status(500).json({ error: 'Failed to generate standalone question.' });
            }

            // Generate embeddings and retrieve context
            console.log("Generating embeddings for standalone question...");
            const embeddings = await generateEmbedding(standaloneQuestion);
            console.log("Embeddings generated:", embeddings);

            console.log("Retrieving context matches from Supabase...");
            const context = await retrieveMatches(embeddings);
            console.log("Context retrieved:", context);

            // Generate final chat response
            console.log("Generating chat response with Gemini model...");
            const answer = await generateChatResponse(context, standaloneQuestion);
            console.log("Chat response generated:", answer);

            console.log("Sending response to client.");
            return res.status(200).json({ senderId, answer });

        } catch (error) {
            console.error("Error processing issue:", error.message);
            return res.status(500).json({ error: 'An error occurred while processing the issue.' });
        }
    }
};
