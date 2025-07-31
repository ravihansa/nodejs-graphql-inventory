import 'dotenv/config';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import cors from 'cors';
import connectDB from './src/config/db.js';
import { typeDefs, resolvers } from './src/graphql/index.js';

const app = express();
const PORT = process.env.PORT || 4000;

async function startServer() {
    await connectDB();
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        formatError: (formattedError, error) => {
            return {
                message: formattedError.message,
                code: formattedError.extensions.code ?? null,
                details: formattedError.extensions.details ?? null,
            };
        },
    });

    await server.start();
    app.use(
        '/graphql',
        cors(),
        express.json(),
        expressMiddleware(server)
    );

    app.listen(PORT, () => {
        console.info(`Server running at http://localhost:${PORT}`);
    });
}

startServer().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
