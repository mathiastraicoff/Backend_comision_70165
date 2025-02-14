import { Router } from "express";
import productController from "../controllers/product.controller.js";
import authenticateToken from "../middleware/authenticateToken.js";

const router = Router();

router.get("/", authenticateToken, async (req, res) => {
	try {
		const products = await productController.getProducts(req.query);
		res.json({ status: "success", products });
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
});

router.post("/:pid/add-to-cart", authenticateToken, async (req, res) => {
	try {
		await productController.addToCart(req, res);
	} catch (error) {
		if (!res.headersSent) {
			res.status(500).json({ status: "error", message: error.message });
		}
	}
});

export default router;
