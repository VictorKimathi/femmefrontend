these are my api 
I want to create a file in my fronetnd to have all the functions to call this backend 
Create the file 
the base url is localhost 5000
create and export them
Use typescript 
Be cautios of type safety



server.js
// Load environment variables
require('dotenv').config();
const cors = require('cors');
// Import dependencies and routes
const express = require('express');
const mongoose = require('mongoose');  // Import mongoose
const userRoutes = require('./src/routes/userRoutes');
const issuesRoutes = require('./src/routes/issuesRoutes');
const sexRoutes = require('./src/routes/sexEducationRoutes'); // Ensure the correct path is used
const emotionRoutes = require('./src/routes/emotionsRoutes');
const calendarRoutes = require('./src/routes/calendarRoutes');
// Swagger dependencies
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Initialize the app and set the port
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());  
app.use(cors());
// MongoDB connection using Mongoose
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB successfully.');
})
.catch((err) => {
  console.error('Failed to connect to MongoDB:', err.message);
});

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentation for API endpoints',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Document the routes in the specified folder
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Route configurations
app.use('/api/users', userRoutes);
app.use('/api/issues', issuesRoutes);  // Prefixed with '/api' for consistency
app.use('/api/sex', sexRoutes);  // Use '/api/sex' as the endpoint
app.use('/api/emotions', emotionRoutes);
app.use('/api/cycles', calendarRoutes);
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});




calendar route


const express = require('express');
const cycleController = require('../controllers/calendarController');
const router = express.Router();


router.post('/', cycleController.createCycle);


router.get('/fertility/:id', cycleController.getFertilityInfo);

router.get('/', cycleController.getAllCycles);

router.get('/:id', cycleController.getCycleById);

router.put('/:id', cycleController.updateCycleById);


 */
router.delete('/:id', cycleController.deleteCycleById);

module.exports = router;




emotions route
=================
const express = require('express');
const { getEmotionAdvice } = require('../controllers/emotionsController');
const router = express.Router();

router.post('/advice', async (req, res) => {
  try {
    const { emotions } = req.body;
    
    if (!Array.isArray(emotions)) {
      return res.status(400).json({ error: "Emotions must be an array" });
    }
    
    const advice = await getEmotionAdvice(emotions);
    res.json(advice);
  } catch (error) {
    console.error('Route error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


fertility route
-------------

const express = require('express');
const router = express.Router();
const FertilityController = require('../controllers/fertilityController');



router.post('/query', FertilityController.handleFertilityQuery);

module.exports = router;


issue route
=========
// routes/issuesRoutes.js



const express = require('express');
const router = express.Router();
const IssuesController = require('../controllers/issuesController');


router.post('/create', IssuesController.createIssue);

module.exports = router;


sex education route
---------------------



const express = require('express');
const SexController = require('../controllers/sexEducationController.js');

const router = express.Router();



router.post('/query', SexController.createEducationResponse);

module.exports = router;


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
            const context = await retrieveMatches(embeddings);
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
