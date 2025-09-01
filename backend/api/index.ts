import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from '../src/routes';
import connectDB from '../src/utils/dbConnect';

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
    origin: "https://note-taking-app-frontend-lake.vercel.app",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use('/', routes);

// Database connection (optimized for serverless)
let isConnected = false;

const connectToDatabase = async () => {
    if (isConnected) {
        return;
    }

    try {
        await connectDB();
        isConnected = true;
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
};

export default async (req: VercelRequest, res: VercelResponse) => {
    try {
        // Connect to database on first request
        await connectToDatabase();

        // Handle the request
        return app(req, res);
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            message: 'Server function failed to execute'
        });
    }
};
