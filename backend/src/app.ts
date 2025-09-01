import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';

// Import utilities
import ApiResponseUtil from './utils/apiResponse';
import connectDB from './utils/dbConnect';

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '5000', 10);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    return ApiResponseUtil.success(res, {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    }, 'Server is running');
});

// Connect to MongoDB and start the server
const startServer = async () => {
    try {
        // Connect to database
        connectDB()

        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log(`Health check: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

export default app;
