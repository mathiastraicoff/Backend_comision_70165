import CartMongo from './mongo/CartMongo.js';
import ProductMongo from './mongo/ProductMongo.js';
import CartMemory from './memory/CartMemory.js';
import ProductMemory from './memory/ProductMemory.js';
import mongoose from 'mongoose';

class Factory {
    static getCartDao() {
        if (process.env.DAO_TYPE === 'mongo') {
            return new CartMongo(mongoose.model('Cart'));
        } else {
            return new CartMemory();
        }
    }

    static getProductDao() {
        if (process.env.DAO_TYPE === 'mongo') {
            return new ProductMongo(mongoose.model('Product'));
        } else {
            return new ProductMemory();
        }
    }
}

export default Factory;

