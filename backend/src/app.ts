import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';

// Import routes
import userRoutes from './routes/user.routes';
import noteRoutes from './routes/note.routes';

// Import utilities
import ApiResponseUtil from './utils/apiResponse';
import connectDB from './utils/dbConnect';

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '5000', 10);

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    return ApiResponseUtil.success(res, {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    }, 'Server is running');
});

// 404 handler
app.use((req: Request, res: Response) => {
    return ApiResponseUtil.notFound(res, 'Endpoint not found');
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    return ApiResponseUtil.internalError(res, 'Something went wrong');
});

// Connect to MongoDB and start the server
const startServer = async () => {
    try {
        // Connect to database
        await connectDB();

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