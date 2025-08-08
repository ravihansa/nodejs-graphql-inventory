import { z } from 'zod';
import mongoose from 'mongoose';

export const objectIdSchema = z.custom().refine(
    (val) => {
        return typeof val === 'string' && mongoose.Types.ObjectId.isValid(val);
    },
    {
        message: "Invalid MongoDB ObjectId",
    }
);
