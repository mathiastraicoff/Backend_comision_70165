import express from "express";
import CartManager from "../service/CartManager.js";
import authenticateToken from "../middleware/authenticateToken.js";
import { validateProductStock } from "../utils.js";

const router = express.Router();
const cartManager = new CartManager();

// Ruta para obtener el carrito del usuario
router.get("/:cid", authenticateToken, async (req, res) => {
	const cart = await cartManager.getCartById(req.params.cid);
	res.json(cart);
});

// Ruta para agregar productos al carrito
router.post("/:cid/products", authenticateToken, async (req, res) => {
	const { cid } = req.params;
	const { productId, quantity } = req.body;
	const product = await cartManager.getProductById(productId);

	if (product && validateProductStock(product, quantity)) {
		await cartManager.addProductToCart(cid, productId, quantity);
		res.json({ message: "Product added to cart" });
	} else {
		res.status(400).json({ message: "Not enough stock" });
	}
});

// Ruta para eliminar productos del carrito
router.delete("/:cid/products/:pid", authenticateToken, async (req, res) => {
	const { cid, pid } = req.params;
	await cartManager.removeProductFromCart(cid, pid);
	res.json({ message: "Product removed from cart" });
});

// Ruta para finalizar la compra
router.post("/:cid/purchase", authenticateToken, async (req, res) => {
	const { cid } = req.params;
	const user = req.user;

	const cart = await cartManager.getCartById(cid);
	const productsToPurchase = [];
	const failedProducts = [];

	for (const item of cart.products) {
		const product = await cartManager.getProductById(item.productId);
		if (product.stock >= item.quantity) {
			await cartManager.purchaseProduct(item.productId, item.quantity);
			productsToPurchase.push(item);
		} else {
			failedProducts.push(item);
		}
	}

	const ticket = await cartManager.createTicket(
		user.email,
		productsToPurchase,
		failedProducts,
	);
	res.json({ ticket, failedProducts });
});

export default router;

