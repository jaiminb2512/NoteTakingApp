import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';

// Import utilities
import ApiResponseUtil from './utils/apiResponse';

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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;
