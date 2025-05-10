const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const http = require('http');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5175', // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/api/shopping-list', require('./shoppingListRoutes'));
app.use('/api/inventory', require('./Invenorty/inventoryRoute'));
app.use('/api/consumption', require('./Consumption/consumptionRoute'));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});