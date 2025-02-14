class CartRepository {
    constructor(cartModel) {
        this.cartModel = cartModel;
    }

    async create(cartData) {
        try {
            const newCart = new this.cartModel(cartData);
            await newCart.save();
            return newCart;
        } catch (error) {
            throw new Error('Error creating cart: ' + error.message);
        }
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

    async getByUserId(userId) {
        try {
            const cart = await this.cartModel.findOne({ userId });
            return cart;
        } catch (error) {
            throw new Error('Error finding cart by user ID: ' + error.message);
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
            cart.products = cart.products.filter(product => product.productId !== productId);
            return await cart.save();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async update(cartId, cartData) {
        try {
            return await this.cartModel.findByIdAndUpdate(cartId, cartData, { new: true });
        } catch (error) {
            throw new Error('Error updating cart: ' + error.message);
        }
    }
}

export default CartRepository;
