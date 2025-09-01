import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Extend global to include mongoose cache
declare global {
    var mongoose: any;
}

// Cache the connection to avoid multiple connections in serverless
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGODB_URI;

        if (!mongoURI) {
            throw new Error('MONGODB_URI environment variable is not defined');
        }

        // If we have a cached connection, return it
        if (cached.conn) {
            return;
        }

        // If we don't have a connection promise, create one
        if (!cached.promise) {
            const opts = {
                bufferCommands: false,
                maxPoolSize: 10, // Maintain up to 10 socket connections
                serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
                socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
                family: 4 // Use IPv4, skip trying IPv6
            };

            cached.promise = mongoose.connect(mongoURI, opts).then((mongoose) => {
                console.log('Connected to MongoDB');
                return mongoose;
            });
        }

        cached.conn = await cached.promise;

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        cached.promise = null; // Reset promise on error
        throw error;
    }
};

export default connectDB;
