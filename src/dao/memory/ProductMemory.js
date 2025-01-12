class ProductMemory {
    constructor() {
        this.products = [];
    }

    async getById(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) throw new Error('Product not found');
        return product;
    }

    async create(productData) {
        this.products.push(productData);
        return productData;
    }

    async update(productId, updatedProduct) {
        const productIndex = this.products.findIndex(p => p.id === productId);
        if (productIndex === -1) throw new Error('Product not found');
        this.products[productIndex] = updatedProduct;
        return updatedProduct;
    }
}

export default ProductMemory;

