import express from "express";
import CartManager from "../service/CartManager.js";
import authenticateToken from "../middleware/authenticateToken.js";
import { validateProductStock } from "../utils/utils.js";

const router = express.Router();
const cartManager = new CartManager();

router.get("/:cid", authenticateToken, async (req, res) => {
    const cart = await cartManager.getCartById(req.params.cid);
    res.json(cart);
});

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

router.delete("/:cid/products/:pid", authenticateToken, async (req, res) => {
    const { cid, pid } = req.params;
    await cartManager.removeProductFromCart(cid, pid);
    res.json({ message: "Product removed from cart" });
});

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
