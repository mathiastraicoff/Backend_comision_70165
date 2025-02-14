import CartRepository from '../repositories/CartRepository.js';
import ProductRepository from '../repositories/ProductRepository.js';
import TicketRepository from '../repositories/TicketRepository.js';
import Cart from '../dao/mongo/models/carts.js';
import Product from '../models/Product.js'; 

class CartManager {
    constructor() {
        this.cartRepo = new CartRepository(Cart);  
        this.productRepo = new ProductRepository(Product);
        this.ticketRepo = new TicketRepository();
    }

    async createCart(userId) {
        try {
            const cart = await this.cartRepo.create({ userId, products: [] });
            return cart;
        } catch (error) {
            throw new Error('Error creating cart: ' + error.message);
        }
    }

    async addProductToCart(userId, productId, quantity) {
        try {
            let cart = await this.cartRepo.getByUserId(userId);
            if (!cart) {
                cart = await this.createCart(userId);
            }
            const product = await this.productRepo.getById(productId);
            
            if (!product) throw new Error('Product not found');
            if (product.stock < quantity) throw new Error('Not enough stock');

            const productInCart = cart.products.find(item => item.productId.equals(productId));
            if (productInCart) {
                productInCart.quantity += quantity;
            } else {
                cart.products.push({ productId, quantity });
            }
            await this.cartRepo.update(cart._id, cart);
            return cart;
        } catch (error) {
            throw new Error('Error adding product to cart: ' + error.message);
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await this.cartRepo.getById(cartId);
            cart.products = cart.products.filter(item => item.productId.toString() !== productId);
            await this.cartRepo.update(cart._id, cart);
            return cart;
        } catch (error) {
            throw new Error('Error removing product from cart: ' + error.message);
        }
    }

    async finalizePurchase(cartId, userEmail) {
        try {
            const cart = await this.cartRepo.getById(cartId);
            let totalAmount = 0;
            let unavailableProducts = [];

            for (let item of cart.products) {
                const product = await this.productRepo.getById(item.productId);

                if (product.stock >= item.quantity) {
                    totalAmount += product.price * item.quantity;
                    product.stock -= item.quantity;
                    await this.productRepo.update(product);
                } else {
                    unavailableProducts.push(item.productId);
                }
            }

            const ticket = await this.ticketRepo.create({
                code: `TICKET-${Date.now()}`,
                amount: totalAmount,
                purchaser: userEmail,
                purchase_datetime: new Date(),
            });

            cart.products = cart.products.filter(item => !unavailableProducts.includes(item.productId));
            await this.cartRepo.update(cart._id, cart);

            return { ticket, unavailableProducts };
        } catch (error) {
            throw new Error('Error finalizing purchase: ' + error.message);
        }
    }

    async getCartCount(cartId) {
        try {
            const cart = await this.cartRepo.getById(cartId);
            return cart.products.length;  
        } catch (error) {
            throw new Error('Error getting cart count: ' + error.message);
        }
    }
}

export default CartManager;
