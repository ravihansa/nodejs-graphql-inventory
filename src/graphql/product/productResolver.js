import Product from '../../models/Product.js';
import Category from '../../models/Category.js';
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

        productsByName: async (_, { name }) => {
            try {
                return await Product.find({ name: new RegExp(name, 'i') });
            } catch (err) {
                exceptionFilter(err, 'Failed to fetch products', 'DATABASE_ERROR');
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
                const { categoryId, ...productObj } = input;
                const existingCategory = await Category.findOne({ _id: categoryId });
                if (!existingCategory) {
                    throw new AppError('Category not found', 'NOT_FOUND');
                }

                const product = new Product({ ...productObj, category: categoryId });
                await product.save();
                return product;
            } catch (err) {
                exceptionFilter(err, 'Failed to create product', 'DATABASE_ERROR');
            }
        },

        updateProduct: async (_, { id, input }) => {
            try {
                updateProductSchema.parse(input);
                if (input.categoryId) {
                    const { categoryId, ...productObj } = input;
                    const existingCategory = await Category.findOne({ _id: categoryId });
                    if (!existingCategory) {
                        throw new AppError('Category not found', 'NOT_FOUND');
                    }
                    input = { ...productObj, category: categoryId };
                }
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
        },
        category: async (parent) => {
            return await Category.findOne({ _id: parent.category });
        }
    }
};

export default productResolver;
