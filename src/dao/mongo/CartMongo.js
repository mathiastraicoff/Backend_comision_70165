class CartMongo {
    constructor(cartModel) {
        this.cartModel = cartModel;
    }

    async getById(cartId) {
        try {
            const cart = await this.cartModel.findById(cartId);
            if (!cart) throw new Error('Cart not found');
            return cart;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async addProduct(cartId, productId, quantity) {
        try {
            const cart = await this.cartModel.findById(cartId);
            if (!cart) throw new Error('Cart not found');
            cart.products.push({ productId, quantity });
            return await cart.save();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async removeProduct(cartId, productId) {
        try {
            const cart = await this.cartModel.findById(cartId);
            if (!cart) throw new Error('Cart not found');
            cart.products = cart.products.filter(p => p.productId !== productId);
            return await cart.save();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async create(cartData) {
        try {
            const cart = new this.cartModel(cartData);
            return await cart.save();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async update(cartId, updatedCart) {
        try {
            return await this.cartModel.findByIdAndUpdate(cartId, updatedCart, { new: true });
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default CartMongo;
