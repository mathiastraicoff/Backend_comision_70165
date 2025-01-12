
import { Router } from 'express';
import passport from 'passport';
import ProductController from '../controllers/product.controller.js';
import CartController from '../controllers/cart.controller.js';
import authenticateToken from "../middleware/authenticateToken.js"; 

const router = Router();
const productController = new ProductController();
const cartController = new CartController();

// Middleware de Passport para verificar el JWT
const authMiddleware = passport.authenticate('jwt', { session: false });

router.get('/', authMiddleware, authenticateToken, async (req, res) => {
    try {
        const products = await productController.getAllProducts(req.query);
        res.json({ status: 'success', products });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.post('/:pid/add-to-cart', authMiddleware, authenticateToken, async (req, res) => {
    try {
        const { pid } = req.params;
        const { quantity, returnTo } = req.body;
        const cartId = req.session.cartId;

        if (!cartId) {
            return res.status(400).json({ status: 'error', message: 'No se encontró el carrito' });
        }

        const cart = await cartController.addProductToCart(cartId, pid, parseInt(quantity, 10));

        if (returnTo) {
            return res.redirect(returnTo);
        }

        res.json({ status: 'success', cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;

