import Product from '../../models/Product.js';
import Inventory from '../../models/Inventory.js';
import AppError from '../../utils/AppError.js';

const productResolver = {
    Query: {
        products: async () => {
            try {
                return await Product.find();
            } catch (err) {
                throw new AppError('Failed to fetch products', 'DATABASE_ERROR', {
                    details: err.message,
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
                throw new AppError('Must provide either id or prodId', 'BAD_USER_INPUT');
            } catch (err) {
                if (err instanceof AppError) throw err;
                throw new AppError('Failed to fetch product', 'DATABASE_ERROR', {
                    details: err.message,
                });
            }
        },

    },

    Mutation: {
        createProduct: async (_, { input }) => {
            try {
                const existingProduct = await Product.findOne({ prodId: input.prodId });
                if (existingProduct) {
                    throw new AppError('ProdId already exists', 'DUPLICATE_ID');
                }

                const product = new Product(input);
                await product.save();
                return product;
            } catch (err) {
                if (err instanceof AppError) throw err;
                throw new AppError('Failed to create product', 'DATABASE_ERROR', {
                    details: err.message,
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
                    throw new AppError('Product not found', 'NOT_FOUND');
                }
                return product;
            } catch (err) {
                if (err instanceof AppError) throw err;
                throw new AppError('Failed to update product', 'DATABASE_ERROR', {
                    details: err.message,
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
                    throw new AppError('Product not found', 'NOT_FOUND');
                }
                return true;
            } catch (err) {
                if (err instanceof AppError) throw err;
                throw new AppError('Failed to delete product', 'DATABASE_ERROR', {
                    details: err.message,
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
