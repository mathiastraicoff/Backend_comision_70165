class CartDTO {
    constructor(cart) {
        this.id = cart._id || cart.id;
        this.products = cart.products || [];
    }

    static from(cart) {
        return new CartDTO(cart);
    }

    toJSON() {
        return {
            id: this.id,
            products: this.products
        };
    }
}

export default CartDTO;
