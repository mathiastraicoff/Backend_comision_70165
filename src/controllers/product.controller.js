import ProductRepository from "../repositories/ProductRepository.js";
import CartManager from "../service/CartManager.js";
import Product from "../models/Product.js";

class ProductController {
	constructor() {
		this.productRepo = new ProductRepository(Product);
		this.cartManager = new CartManager();
	}

	async getProducts(query) {
		try {
			const products = await this.productRepo.getAll(query);
			return products;
		} catch (error) {
			throw new Error("Error al obtener productos");
		}
	}

	async getProductById(req, res) {
		try {
			const product = await this.productRepo.getById(req.params.pid);
			if (!product) {
				return res.status(404).json({ message: "Producto no encontrado" });
			}
			res.json(product);
		} catch (error) {
			res.status(500).json({ message: "Error al obtener el producto" });
		}
	}

	async createProduct(req, res) {
		try {
			const newProduct = await this.productRepo.create(req.body);
			res.status(201).json(newProduct);
		} catch (error) {
			res.status(500).json({ message: "Error al crear el producto" });
		}
	}

	async updateProduct(req, res) {
		try {
			const updatedProduct = await this.productRepo.update(
				req.params.pid,
				req.body,
			);
			if (!updatedProduct) {
				return res.status(404).json({ message: "Producto no encontrado" });
			}
			res.json(updatedProduct);
		} catch (error) {
			res.status(500).json({ message: "Error al actualizar el producto" });
		}
	}

	async addToCart(req, res) {
		try {
			const userId = req.user.id;
			const productId = req.params.pid;
			const { quantity } = req.body;

			const cart = await this.cartManager.addProductToCart(
				userId,
				productId,
				quantity,
			);
			res.status(200).json(cart);
		} catch (error) {
			console.error("Error al añadir producto al carrito:", error);
			if (!res.headersSent) {
				res.status(500).json({
					message: "Error al añadir producto al carrito",
					error: error.message,
				});
			}
		}
	}
}

export default new ProductController();
