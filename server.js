const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// configuration
const USER_PROFILE = {
    email: process.env.USER_EMAIL || "qozeemodeniran@gmail.com",
    name: process.env.USER_NAME || "Qozeem Odenainran",
    stack: process.env.USER_STACK || "Node.js/Express",
};

// cat facts api service
const catFactService = {
    async getRandomFact() {
        try {
            const response = await axios.get('https://catfact.ninja/fact', {
                timeout: 5000
            });
            if (response.data && response.data.fact) {
                return {
                    success: true,
                    fact: response.data.fact 
                };
            }
            throw new Error('Invalid response format');
        } catch (error) {
            console.error('Cat Facts API Error:', error.message);

            // fallback cat facts
            const fallbackFacts = [
                "Cats sleep for 70% of their lives.",
                "A group of cats is called a clowder.",
                "Cats have five toes on their front paws, but only four on the back ones.",
                "Cats can rotate their ears 180 degrees.",
                "The oldest known pet cat was found in a 9,500-year-old grave on the Mediterranean island of Cyprus."
            ];

            const getRandomFact = fallbackFacts[Math.floor(Math.random() * fallbackFacts.length)];
            return {
                success: false,
                fact: getRandomFact,
                message: error.message
            };
        }
    }
};

// GET /me endpoint
app.get('/me', async(req, res) => {
    try {
        const timestamp = new Date().toISOString();
        const catFactResult = await catFactService.getRandomFact();

        const response = {
            status: "success",
            user: {
                email: USER_PROFILE.email,
                name: USER_PROFILE.name,
                stack: USER_PROFILE.stack
            },
            timestamp: timestamp,
            fact: catFactResult.fact
        };

        // log the result
        console.log(`[${timestamp}] GET /me - Fact fetched: ${catFactResult.success ? 'From API' : 'Fallback'}`);

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(response);
    } catch (error) {
        console.error('Server Error:', error);

        res.status(500).json({
            status: "error",
            message: "Internal Server Error",
            timestamp: new Date().toISOString()
        });
    }
});

// health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Server is healthy",
        timestamp: new Date().toISOString()
    });
});

// root endpoint
app.get('/', (req, res) => {
    res.json({
        message: "Backend Wizards Stage 0 API",
        endpoints: {
            "/me": "GET - Profile information with cat fact",
            "/health": "GET - health check"
        },
        timestamp: new Date().toISOString()
    });
});

// handle 404 (endpoint not found) error
app.use('*', (req, res) => {
    res.status(404).json({
        status: "error",
        message: "Endpoint not found",
        timestamp: new Date().toISOString()
    });
});

// error handling middleware
app.use ((error, req, res, next) => {
    console.error('Unhandled Error:', error);
    res.status(500).json({
        status: "error",
        message: "Internal Server Error",
        timestamp: new Date().toISOString()
    });
});

// server ignition
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Profile endpoint: http://0.0.0.0:${PORT}/me`);
    console.log(`Health check: http://0.0.0.0:${PORT}/health`);
});

module.exports = app;