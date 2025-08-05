import { describe, it, expect, vi, beforeEach } from 'vitest';
import AppError from '../../src/utils/AppError.js';
import Product from '../../src/models/Product.js';
import productResolver from '../../src/graphql/product/productResolver.js';


vi.mock('../../src/models/Product.js');
vi.mock('../../src/utils/exceptionFilter.js', () => ({
    default: vi.fn((err) => { throw err; })
    // default: vi.fn((err, msg, code) => { throw new AppError(msg, code); })
}));

describe('productResolver', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Query', () => {
        describe('products', () => {
            it('should return all products', async () => {
                const mockProducts = [
                    { id: '1', prodId: 'PROD-1001', name: 'Product 1', price: 1000, },
                    { id: '2', prodId: 'PROD-1002', name: 'Product 2', price: 2000, }
                ];
                Product.find.mockResolvedValue(mockProducts);

                const result = await productResolver.Query.products();

                expect(Product.find).toHaveBeenCalled();
                expect(result).toEqual(mockProducts);
            });

            it('should throw error when database fails', async () => {
                const mockError = new Error('Failed to fetch products');
                Product.find.mockRejectedValue(mockError);

                await expect(productResolver.Query.products()).rejects.toThrow('Failed to fetch products');
            });
        });

        describe('product', () => {
            it('should find product by id', async () => {
                const mockProduct = { id: '1', prodId: 'PROD-1001', name: 'Product 1', price: 1000, };
                Product.findById.mockResolvedValue(mockProduct);

                const result = await productResolver.Query.product(null, { id: '1' });

                expect(Product.findById).toHaveBeenCalledWith('1');
                expect(result).toEqual(mockProduct);
            });

            it('should find product by prodId', async () => {
                const mockProduct = { id: '1', prodId: 'PROD-1001', name: 'Product 1', price: 1000, };
                Product.findOne.mockResolvedValue(mockProduct);

                const result = await productResolver.Query.product(null, { prodId: 'PROD-1001' });

                expect(Product.findOne).toHaveBeenCalledWith({ prodId: 'PROD-1001' });
                expect(result).toEqual(mockProduct);
            });

            it('should throw error when neither id nor prodId provided', async () => {
                await expect(productResolver.Query.product(null, {})).rejects.toThrow('Must provide either id or prodId');
            });

            it('should throw error when database fails', async () => {
                const mockError = new Error('Failed to fetch product');
                Product.findById.mockRejectedValue(mockError);
                await expect(productResolver.Query.product(null, { id: '1' })).rejects.toThrow('Failed to fetch product');
            });
        });
    });

});
