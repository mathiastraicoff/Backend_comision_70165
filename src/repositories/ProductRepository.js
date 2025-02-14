class ProductRepository {
    constructor(productModel) {
        this.productModel = productModel;
    }

    async getProducts() {
        try {
            return await this.productModel.find(); 
        } catch (error) {
            throw new Error('Error al obtener los productos: ' + error.message);
        }
    }

    async getById(productId) {
        try {
            const product = await this.productModel.findById(productId);
            if (!product) throw new Error('Producto no encontrado');
            return product;
        } catch (error) {
            throw new Error('Error al obtener el producto: ' + error.message);
        }
    }

    async update(product) {
        try {
            return await product.save();
        } catch (error) {
            throw new Error('Error al actualizar el producto: ' + error.message);
        }
    }
}

export default ProductRepository;
