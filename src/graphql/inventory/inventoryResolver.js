import Product from '../../models/Product.js';
import Inventory from '../../models/Inventory.js';
import AppError from '../../utils/AppError.js';
import exceptionFilter from '../../utils/exceptionFilter.js';

const inventoryResolver = {

    Query: {
        inventories: async () => {
            try {
                return await Inventory.find();
            } catch (err) {
                exceptionFilter(err, 'Failed to fetch inventories', 'DATABASE_ERROR');
            }
        },

        inventory: async (_, { productId }) => {
            try {
                if (productId) {
                    return await Inventory.findOne({ productId });
                }
                throw new AppError('Must provide productId', 'BAD_USER_INPUT');
            } catch (err) {
                exceptionFilter(err, 'Failed to fetch inventory', 'DATABASE_ERROR');
            }
        },

    },

    Mutation: {
        createInventory: async (_, { input }) => {
            try {
                const product = await Product.findById(input.productId);
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
                exceptionFilter(err, 'Failed to create inventory', 'DATABASE_ERROR');
            }
        },

        updateInventory: async (_, { id, input }) => {
            try {
                const inventory = await Inventory.findByIdAndUpdate(
                    id,
                    { $set: input },
                    { new: true, runValidators: true }
                );

                if (!inventory) {
                    throw new AppError('Inventory record not found', 'NOT_FOUND');
                }
                return inventory;
            } catch (err) {
                exceptionFilter(err, 'Failed to update inventory', 'DATABASE_ERROR');
            }
        },

        adjustInventory: async (_, { id, quantity }) => {
            try {
                const inventory = await Inventory.findByIdAndUpdate(
                    id,
                    { $inc: { quantity } },
                    { new: true }
                );

                if (!inventory) {
                    throw new AppError('Inventory record not found', 'NOT_FOUND');
                }

                // Update the status based on new quantity
                inventory.status = inventory.quantity > 0;
                await inventory.save();
                return inventory;
            } catch (err) {
                exceptionFilter(err, 'Failed to adjust the inventory', 'DATABASE_ERROR');
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
