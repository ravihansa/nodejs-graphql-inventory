import { ZodError } from 'zod';
import AppError from './AppError.js';
import { logError } from './logger.js';

const exceptionFilter = (error, msg, code) => {

    if (error instanceof AppError) {
        const errCode = error?.extensions?.code ?? null;
        const errDetails = error?.extensions?.details ?? null;
        logError(error.name, error.message, errCode, errDetails, error.stack);
        throw error;
    }

    if (error instanceof ZodError) {
        const details = error.issues.map(e => e.message).join(', ');
        logError(error.name, 'Input validation error', 'BAD_USER_INPUT', details, error.stack);
        throw new AppError('Input validation error', 'BAD_USER_INPUT', { details });
    }

    logError(error.name, msg, code, error.message, error.stack);
    throw new AppError(msg, code, { details: error.message });
};

export default exceptionFilter;
