class CartMongo {
    constructor(cartModel) {
        this.cartModel = cartModel;
    }

    async getById(cartId) {
        try {
            const cart = await this.cartModel.findById(cartId).populate('products.productId');
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

            const existingProduct = cart.products.find(p => p.productId.toString() === productId);
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ productId, quantity });
            }

            return await cart.save();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async removeProduct(cartId, productId) {
        try {
            const cart = await this.cartModel.findById(cartId);
            if (!cart) throw new Error('Cart not found');

            cart.products = cart.products.filter(p => p.productId.toString() !== productId);

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
            const exists = await this.cartModel.exists({ _id: cartId });
            if (!exists) throw new Error('Cart not found');
            
            return await this.cartModel.findByIdAndUpdate(cartId, updatedCart, { new: true });
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default CartMongo;
