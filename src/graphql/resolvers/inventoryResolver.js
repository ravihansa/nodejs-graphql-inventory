import Product from '../../models/Product.js';
import Inventory from '../../models/Inventory.js';
import AppError from '../../utils/AppError.js';

const inventoryResolver = {

    Query: {
        inventories: async () => {
            try {
                return await Inventory.find();
            } catch (err) {
                throw new AppError('Failed to fetch inventories', 'DATABASE_ERROR', {
                    details: err.message,
                });
            }
        },

        inventory: async (_, { productId }) => {
            try {
                if (productId) {
                    return await Inventory.findOne({ productId });
                }
                throw new AppError('Must provide productId', 'BAD_USER_INPUT');
            } catch (err) {
                if (err instanceof AppError) throw err;
                throw new AppError('Failed to fetch inventory', 'DATABASE_ERROR', {
                    details: err.message,
                });
            }
        },

    },

    Mutation: {
        createInventory: async (_, { productId, input }) => {
            try {
                const product = await Product.findById(productId);
                if (!product) {
                    throw new AppError('Product not found', 'NOT_FOUND');
                }
                const inventory = await Inventory.findOne({ productId: product.id });
                if (inventory) {
                    throw new AppError('Inventory already exists', 'DUPLICATE_ID');
                }

                const newInventory = new Inventory(input);
                await newInventory.save();
                return newInventory;
            } catch (err) {
                if (err instanceof AppError) throw err;
                throw new AppError('Failed to create inventory', 'DATABASE_ERROR', {
                    details: err.message,
                });
            }
        },
    },

    Inventory: {
        product: async (parent) => {
            return await Product.findOne({ _id: parent.productId });
        }
    }
};

export default inventoryResolver;
