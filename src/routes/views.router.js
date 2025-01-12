import { Router } from 'express';
import ProductManager from '../service/ProductManager.js';
import CartManager from '../service/CartManager.js';
import authenticateToken from "../middleware/authenticateToken.js"; 

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.use((req, res, next) => {
    console.log("Ruta de vista llamada:", req.path);
    next();
});

router.use(async (req, res, next) => {
    if (!req.session.cartId) {
        const newCart = await cartManager.createCart();
        req.session.cartId = newCart._id;
    }
    req.cartId = req.session.cartId;
    next();
});

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getRandomProducts(10);
        const cartCount = await cartManager.getCartCount(req.cartId);
        res.render('home', { products, cartCount });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error en el servidor');
    }
});

router.get('/home', authenticateToken, async (req, res) => {
    try {
        const products = await productManager.getRandomProducts(10);
        const cartCount = await cartManager.getCartCount(req.cartId);
        res.render('home', { products, cartCount });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error en el servidor');
    }
});

router.get('/products', async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort;
    const query = req.query.query || '';

    try {
        const { products, totalPages } = await productManager.getAll({ limit, page, sort, query });
        const cartCount = await cartManager.getCartCount(req.cartId);

        res.render('products', {
            products,
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null,
            limit,
            sort,
            query,
            cartCount,
        });
    } catch (error) {
        console.error('Error en /products:', error);
        res.status(500).send('Error al obtener productos');
    }
});

router.get('/products/:pid', async (req, res) => {
    const productId = req.params.pid;

    try {
        const product = await productManager.getProductById(productId);
        const cartCount = await cartManager.getCartCount(req.cartId);

        if (product) {
            res.render('productDetail', {
                product,
                cartCount,
                cartId: req.cartId,
            });
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        console.error('Error en /products/:pid:', error);
        res.status(500).send('Error al obtener el producto');
    }
});

router.get('/carts', authenticateToken, async (req, res) => {
    const cartId = req.cartId;

    try {
        const cart = await cartManager.getCartById(cartId);
        const cartCount = await cartManager.getCartCount(cartId);
        if (cart) {
            res.render('cartDetail', {
                cart,
                cartCount,
            });
        } else {
            res.status(404).send('Carrito no encontrado');
        }
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).send('Error al obtener el carrito');
    }
});

router.get('/register', (req, res) => {
    console.log("Accediendo a /register");
    res.render('register');
});

router.get('/login', (req, res) => {
    console.log("Accediendo a /login");
    res.render('login');
});

export default router;
