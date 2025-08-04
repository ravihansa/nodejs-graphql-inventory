import Product from '../../models/Product.js';
import Inventory from '../../models/Inventory.js';
import AppError from '../../utils/AppError.js';
import exceptionFilter from '../../utils/exceptionFilter.js';
import { createProductSchema, updateProductSchema } from './productValidator.js';

const productResolver = {
    Query: {
        products: async () => {
            try {
                return await Product.find();
            } catch (err) {
                exceptionFilter(err, 'Failed to fetch products', 'DATABASE_ERROR');
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
                exceptionFilter(err, 'Failed to fetch product', 'DATABASE_ERROR');
            }
        },

    },

    Mutation: {
        createProduct: async (_, { input }) => {
            try {
                createProductSchema.parse(input);
                const existingProduct = await Product.findOne({ prodId: input.prodId });
                if (existingProduct) {
                    throw new AppError('ProdId already exists', 'DUPLICATE_ID');
                }

                const product = new Product(input);
                await product.save();
                return product;
            } catch (err) {
                exceptionFilter(err, 'Failed to create product', 'DATABASE_ERROR');
            }
        },

        updateProduct: async (_, { id, input }) => {
            try {
                updateProductSchema.parse(input);
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
                exceptionFilter(err, 'Failed to update product', 'DATABASE_ERROR');
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
                exceptionFilter(err, 'Failed to delete product', 'DATABASE_ERROR');
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
