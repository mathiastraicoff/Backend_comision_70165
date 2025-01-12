import CartRepository from '../repositories/CartRepository.js';
import ProductRepository from '../repositories/ProductRepository.js';
import TicketRepository from '../repositories/TicketRepository.js';
import Cart from '../dao/mongo/models/carts.js'; 

class CartManager {
    constructor() {
        this.cartRepo = new CartRepository(Cart);  
        this.productRepo = new ProductRepository();
        this.ticketRepo = new TicketRepository();
    }

    async createCart() {
        try {
            const cart = await this.cartRepo.create();  
            return cart;
        } catch (error) {
            throw new Error('Error creating cart: ' + error.message);  
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        try {
            const cart = await this.cartRepo.getById(cartId);
            const product = await this.productRepo.getById(productId);
            
            if (!product) throw new Error('Product not found');
            if (product.stock < quantity) throw new Error('Not enough stock');

            cart.products.push({ productId, quantity });
            await this.cartRepo.update(cartId, cart);
            return cart;
        } catch (error) {
            throw new Error('Error adding product to cart: ' + error.message);
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await this.cartRepo.getById(cartId);
            cart.products = cart.products.filter(item => item.productId !== productId);
            await this.cartRepo.update(cartId, cart);
            return cart;
        } catch (error) {
            throw new Error('Error removing product from cart');
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
                    await this.productRepo.update(product.id, product);
                } else {
                    unavailableProducts.push(item.productId);
                }
            }

            // Crear el ticket
            const ticket = await this.ticketRepo.create({
                code: `TICKET-${Date.now()}`,
                amount: totalAmount,
                purchaser: userEmail,
                purchase_datetime: new Date(),
            });

            // Actualizar el carrito con los productos restantes (aquellos que no se pudieron comprar)
            cart.products = cart.products.filter(item => !unavailableProducts.includes(item.productId));
            await this.cartRepo.update(cartId, cart);

            return { ticket, unavailableProducts };
        } catch (error) {
            throw new Error('Error finalizing purchase: ' + error.message);
        }
    }

    // Nuevo método getCartCount para contar productos en el carrito
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
