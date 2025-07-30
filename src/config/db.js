import 'dotenv/config';
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            connectTimeoutMS: Number(process.env.MONGO_TIMEOUT),
        });
        console.log('MongoDB connection succeeded');
    } catch (err) {
        console.error('Database connection error:', err.message);
        process.exit(1);
    }
};

export default connectDB;
