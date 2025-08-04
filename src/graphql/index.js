import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import productTypeDef from './product/productTypeDef.js';
import inventoryTypeDef from './inventory/inventoryTypeDef.js'
import productResolver from './product/productResolver.js';
import inventoryResolver from './inventory/inventoryResolver.js';

export const typeDefs = mergeTypeDefs([productTypeDef, inventoryTypeDef]);
export const resolvers = mergeResolvers([productResolver, inventoryResolver]);
