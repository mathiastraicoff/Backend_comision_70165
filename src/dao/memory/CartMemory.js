class CartMemory {
    constructor() {
        this.carts = [];
    }

    async getById(cartId) {
        const cart = this.carts.find(c => c.id === cartId);
        if (!cart) throw new Error('Cart not found');
        return cart;
    }

    async addProduct(cartId, productId, quantity) {
        let cart = await this.getById(cartId);
        cart.products.push({ productId, quantity });
        return cart;
    }

    async removeProduct(cartId, productId) {
        let cart = await this.getById(cartId);
        cart.products = cart.products.filter(product => product.productId !== productId);
        return cart;
    }

    async create(cartData) {
        this.carts.push(cartData);
        return cartData;
    }

    async update(cartId, updatedCart) {
        let cartIndex = this.carts.findIndex(c => c.id === cartId);
        if (cartIndex === -1) throw new Error('Cart not found');
        this.carts[cartIndex] = updatedCart;
        return updatedCart;
    }
}

export default CartMemory;
