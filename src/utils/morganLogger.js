import morgan from 'morgan';
import { logInfo } from './logger.js';
import { graphQlQueryToJson } from 'graphql-query-to-json';


morgan.token('graphql-query', (req) => {
    if (req.method === 'POST' && req.body?.query) {
        const operation = req.body.operationName || 'Not Defined';
        if (operation === 'IntrospectionQuery') {
            return 'Introspection Query';
        }
        try {
            const reqQueryJson = graphQlQueryToJson(req.body.query);
            return `| Operation: ${operation} | Query: ${JSON.stringify(reqQueryJson)}`;
        } catch (error) {
            console.info(error.message);
            return `| Operation: ${operation} | Query: ${JSON.stringify(req.body.query)}`;
        }
    }
    return '';
});

// Custom morgan format
const morganFormat = ':method :url :status :res[content-length] - :response-time ms :graphql-query';

export const morganMiddleware = morgan(morganFormat, {
    stream: {
        write: (message) => logInfo('Incoming Request', message.trim()),
    },
    skip: (req) => req.url === '/favicon.ico',
});
