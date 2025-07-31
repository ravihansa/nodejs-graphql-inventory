import { GraphQLError } from 'graphql';

class AppError extends GraphQLError {
    constructor(message, code = 'INTERNAL_SERVER_ERROR', extensions = {}) {
        super(message, {
            extensions: {
                code,
                ...extensions,
            },
        });
    }
}

export default AppError;
