import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import connectDB from './utils/dbConnect';

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

// Routes
app.use('/api', routes);

// Database connection
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export { app };