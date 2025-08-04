import { describe, it, expect } from 'vitest';
import { createProductSchema } from '../src/graphql/product/productValidator.js';

describe('Product Validation', () => {
    it('should pass for valid input', () => {
        const input = {
            prodId: 'PROD-1001',
            name: 'Keyboard',
            brand: 'Dell',
            price: 1000,
            isActive: true,
        };
        expect(() => createProductSchema.parse(input)).not.toThrow();
    });

    it('should fail for missing name', () => {
        const input = {
            prodId: 'PROD-1002',
            brand: 'Dell',
            price: 1000,
            isActive: true,
        };
        expect(() => createProductSchema.parse(input)).toThrow();
    });

    it('should fail for invalid product id', () => {
        const input = {
            prodId: 'PROD-100199',
            name: 'Keyboard',
            brand: 'Dell',
            price: 1000,
            isActive: true,
        };
        expect(() => createProductSchema.parse(input)).toThrow();
    });

    it('should fail for invalid price', () => {
        const input = {
            prodId: 'PROD-1001',
            name: 'Keyboard',
            brand: 'Dell',
            price: 1000.999,
            isActive: true,
        };
        expect(() => createProductSchema.parse(input)).toThrow();
    });

});
