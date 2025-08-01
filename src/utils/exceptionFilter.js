import { ZodError } from 'zod';
import AppError from './AppError.js';

const exceptionFilter = (error, msg, code) => {
    if (error instanceof AppError) {
        throw error;
    }

    if (error instanceof ZodError) {
        const details = error.issues.map(e => e.message).join(', ');
        throw new AppError('Input validation error', 'BAD_USER_INPUT', { details });
    }

    throw new AppError(msg, code, { details: error.message });
};

export default exceptionFilter;
