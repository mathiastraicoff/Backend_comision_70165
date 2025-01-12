
import ProductRepository from '../repositories/ProductRepository.js';

class ProductController {
    async getProducts(req, res) {
        try {
            const products = await ProductRepository.getAll();
            return res.json(products);
        } catch (error) {
            res.status(500).json({ message: 'Error getting products' });
        }
    }

    async getProductById(req, res) {
        try {
            const product = await ProductRepository.getById(req.params.pid);
            if (!product) return res.status(404).json({ message: 'Product not found' });
            return res.json(product);
        } catch (error) {
            res.status(500).json({ message: 'Error getting product' });
        }
    }

    async createProduct(req, res) {
        try {
            const newProduct = await ProductRepository.create(req.body);
            return res.status(201).json(newProduct);
        } catch (error) {
            res.status(500).json({ message: 'Error creating product' });
        }
    }

    async updateProduct(req, res) {
        try {
            const updatedProduct = await ProductRepository.update(req.params.pid, req.body);
            if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
            return res.json(updatedProduct);
        } catch (error) {
            res.status(500).json({ message: 'Error updating product' });
        }
    }
}

export default ProductController;
