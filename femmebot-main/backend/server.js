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
