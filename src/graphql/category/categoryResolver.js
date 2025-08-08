import Product from '../../models/Product.js';
import Category from '../../models/Category.js';
import exceptionFilter from '../../utils/exceptionFilter.js';

const categoryResolver = {

    Query: {
        categories: async () => {
            try {
                return await Category.find();
            } catch (err) {
                exceptionFilter(err, 'Failed to fetch categories', 'DATABASE_ERROR');
            }
        },

    },

    Mutation: {
        createCategory: async (_, { input }) => {
            try {
                const category = new Category(input);
                await category.save();
                return category;
            } catch (err) {
                exceptionFilter(err, 'Failed to create category', 'DATABASE_ERROR');
            }
        },
    },

    Category: {
        products: async (parent) => {
            return await Product.find({ category: parent._id });
        }
    }
};

export default categoryResolver;
