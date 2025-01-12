class CartRepository {
    constructor(cartModel) {
        this.cartModel = cartModel;  // Modelo de Cart pasado al repositorio
    }

    async create() {
        try {
            const newCart = new this.cartModel({ products: [] });  // Crear un carrito vacío
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

    async update(cart) {
        try {
            return await cart.save();
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default CartRepository;
