import ProductRepository from '../repositories/ProductRepository.js';
import ProductModel from '../models/Product.js';
import productController from '../controllers/product.controller.js';

class ProductManager {
    constructor() {
        this.productRepo = new ProductRepository(ProductModel);
        this.productController = productController;
    }

    async getProductById(productId) {
        try {
            const product = await this.productRepo.getById(productId);
            return product;
        } catch (error) {
            throw new Error('Error obteniendo el producto: ' + error.message);
        }
    }

    async updateProductStock(productId, quantity) {
        try {
            const product = await this.productRepo.getById(productId);
            if (!product) throw new Error('Producto no encontrado');

            product.stock += quantity;
            await this.productRepo.update(product);
            return product;
        } catch (error) {
            throw new Error('Error al actualizar el stock del producto: ' + error.message);
        }
    }

    async getRandomProducts(count = 5) {
        try {
            const allProducts = await this.productRepo.getProducts();
            const shuffled = allProducts.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        } catch (error) {
            throw new Error('Error al obtener productos aleatorios: ' + error.message);
        }
    }

    async getAll({ limit, page, sort, query }) {
        try {
            const options = {
                limit,
                skip: (page - 1) * limit,
                sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
            };

            const filters = query ? { name: { $regex: query, $options: 'i' } } : {};

            const [products, total] = await Promise.all([
                this.productRepo.productModel.find(filters, null, options),
                this.productRepo.productModel.countDocuments(filters),
            ]);

            const totalPages = Math.ceil(total / limit);

            return { products, totalPages };
        } catch (error) {
            throw new Error('Error al obtener todos los productos: ' + error.message);
        }
    }

    async getProducts(req, res) {
        return this.productController.getProducts(req, res);
    }

    async getProductByIdController(req, res) {
        return this.productController.getProductById(req, res);
    }

    async createProduct(req, res) {
        return this.productController.createProduct(req, res);
    }

    async updateProduct(req, res) {
        return this.productController.updateProduct(req, res);
    }

    async addToCart(req, res) {
        return this.productController.addToCart(req, res);
    }
}

export default ProductManager;
