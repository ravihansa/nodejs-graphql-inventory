import Product from '../../models/Product.js';
import Inventory from '../../models/Inventory.js';
import { GraphQLError } from 'graphql';

const productResolver = {
    Query: {
        products: async () => {
            try {
                return await Product.find();
            } catch (err) {
                throw new GraphQLError('Failed to fetch products', {
                    extensions: {
                        code: 'DATABASE_ERROR',
                        details: err.message,
                    },
                });
            }
        },

        product: async (_, { id, prodId }) => {
            try {
                if (id) {
                    return await Product.findById(id);
                } else if (prodId) {
                    return await Product.findOne({ prodId });
                }
                throw new GraphQLError('Must provide either id or prodId', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    },
                });
            } catch (err) {
                throw new GraphQLError('Failed to fetch products', {
                    extensions: {
                        code: 'DATABASE_ERROR',
                        details: err.message,
                    },
                });
            }
        },

    },

    Mutation: {
        createProduct: async (_, { input }) => {
            try {
                const existingProduct = await Product.findOne({ prodId: input.prodId });
                if (existingProduct) {
                    throw new GraphQLError('ProdId already exists', {
                        extensions: {
                            code: 'DUPLICATE_ID',
                        },
                    });
                }

                const product = new Product(input);
                await product.save();
                return product;
            } catch (err) {
                if (err instanceof GraphQLError) throw err;
                throw new GraphQLError('Failed to create product', {
                    extensions: {
                        code: 'DATABASE_ERROR',
                        details: err.message,
                    },
                });
            }
        },

        updateProduct: async (_, { id, input }) => {
            try {
                const product = await Product.findByIdAndUpdate(
                    id,
                    { $set: input },
                    { new: true, runValidators: true }
                );

                if (!product) {
                    throw new GraphQLError('Product not found', {
                        extensions: {
                            code: 'NOT_FOUND',
                        },
                    });
                }
                return product;
            } catch (err) {
                if (err instanceof GraphQLError) throw err;
                throw new GraphQLError('Failed to update product', {
                    extensions: {
                        code: 'DATABASE_ERROR',
                        details: err.message,
                    },
                });
            }
        },

        deleteProduct: async (_, { id }) => {
            try {
                const product = await Product.findByIdAndUpdate(
                    id,
                    { $set: { isActive: false } },
                    { new: true }
                );

                if (!product) {
                    throw new GraphQLError('Product not found', {
                        extensions: {
                            code: 'NOT_FOUND',
                        },
                    });
                }
                return true;
            } catch (err) {
                if (err instanceof GraphQLError) throw err;
                throw new GraphQLError('Failed to delete product', {
                    extensions: {
                        code: 'DATABASE_ERROR',
                        details: err.message,
                    },
                });
            }
        },
    },

    Product: {
        inventory: async (parent) => {
            return await Inventory.findOne({ productId: parent._id });
        }
    }
};

export default productResolver;
