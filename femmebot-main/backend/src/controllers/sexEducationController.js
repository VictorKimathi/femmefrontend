// Use require for module imports
const { generateStandaloneQuestion, generateEmbedding, retrieveMatches, generateChatResponse } = require('../utils/aiHelpers.js');

class SexController {
    static async createEducationResponse(req, res) {
        try {
            console.log("Received POST request to /sex-education/query");
            console.log("Request body:", req.body);

            const { question, senderId } = req.body;    

            // Ensure that required fields are present
            if (!question || !senderId) {
                console.log("Missing required fields: question or senderId.");
                return res.status(400).json({ error: 'Question and senderId are required.' });
            }

            // Generate standalone question for clarity
            console.log("Generating standalone question...");
            const standaloneQuestion = await generateStandaloneQuestion(question);
            if (!standaloneQuestion) {
                console.log("Error: Standalone question generation failed.");
                return res.status(500).json({ error: 'Failed to generate standalone question.' });
            }
            console.log("Standalone question generated:", standaloneQuestion);

            // Generate embeddings for the question
            console.log("Generating embeddings for standalone question...");
            const embeddings = await generateEmbedding(standaloneQuestion);
            if (!embeddings) {
                console.log("Error: Embeddings generation failed.");
                return res.status(500).json({ error: 'Failed to generate embeddings.' });
            }
            console.log("Embeddings generated:", embeddings);

            // Retrieve context matches from the database
            console.log("Retrieving context matches from Supabase for sex education...");
            const context = async (embedding) => {
                const { data, error } = await supabaseClient.rpc('match_documents', {
                    query_embedding: embedding,
                    filter: null, // Set to `null` if filtering isn't required
                    match_count: 10
                });
            
                if (error) {
                    console.error("Error retrieving matches:", error);
                    return null; // Indicate an error occurred
                }
            
                return data?.map(chunk => chunk.content).join(" ") || "";
            };

            console.log("Context matches retrieved:", context);
            
            
            if (!context) {
                console.log("Error: Context retrieval failed.");
                return res.status(500).json({ error: 'Failed to retrieve context.' });
            }
            console.log("Context retrieved:", context);


          
            




            // Generate chat response from the context
            console.log("Generating chat response with Gemini model...");
            const answer = await generateChatResponse(context, standaloneQuestion);
            if (!answer) {
                console.log("Error: Failed to generate chat response.");
                return res.status(500).json({ error: 'Failed to generate chat response.' });
            }
            console.log("Chat response generated:", answer);

            // Return the final answer to the client
            console.log("Sending response to client.");
            return res.status(200).json({ senderId, answer });

        } catch (error) {
            console.error("Error processing sex education query:", error.message);
            return res.status(500).json({ error: 'An error occurred while processing the sex education query.' });
        }
    }
}

module.exports = SexController;
