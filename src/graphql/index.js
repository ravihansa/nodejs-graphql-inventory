import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import productTypeDef from './typeDefs/productTypeDef.js';
import inventoryTypeDef from './typeDefs/inventoryTypeDef.js'
import productResolver from './resolvers/productResolver.js';

export const typeDefs = mergeTypeDefs([productTypeDef, inventoryTypeDef]);
export const resolvers = mergeResolvers([productResolver]);
