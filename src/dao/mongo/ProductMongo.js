class ProductMongo {
    constructor(productModel) {
        this.productModel = productModel;
    }

    async getById(productId) {
        try {
            const product = await this.productModel.findById(productId);
            if (!product) throw new Error('Product not found');
            return product;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async update(productId, updatedProduct) {
        try {
            const exists = await this.productModel.exists({ _id: productId });
            if (!exists) throw new Error('Product not found');

            return await this.productModel.findByIdAndUpdate(productId, updatedProduct, { new: true });
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async create(productData) {
        try {
            const product = new this.productModel(productData);
            return await product.save();
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default ProductMongo;
