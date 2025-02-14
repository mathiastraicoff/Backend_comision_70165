import CartRepository from '../repositories/CartRepository.js';
import ProductRepository from '../repositories/ProductRepository.js';
import CartDTO from '../dao/dto/CartDTO.js';

class CartController {
    async getCart(req, res) {
        try {
            const cart = await CartRepository.getById(req.params.cid);
            return res.json(new CartDTO(cart));
        } catch (error) {
            res.status(404).json({ message: 'Cart not found' });
        }
    }

    async addProduct(req, res) {
        try {
            const { productId, quantity } = req.body;
            const product = await ProductRepository.getById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            const cart = await CartRepository.addProduct(req.params.cid, productId, quantity);
            return res.json(new CartDTO(cart));
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async removeProduct(req, res) {
        try {
            const { productId } = req.body;
            const cart = await CartRepository.removeProduct(req.params.cid, productId);
            return res.json(new CartDTO(cart));
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async createCart(req, res) {
        try {
            const newCart = await CartRepository.create(req.body);
            return res.status(201).json(new CartDTO(newCart));
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async purchase(req, res) {
        try {
            const cart = await CartRepository.getById(req.params.cid);
            const productsToBuy = cart.products.filter(product => product.quantity <= product.stock);
            const productsOutOfStock = cart.products.filter(product => product.quantity > product.stock);

            
            for (const product of productsToBuy) {
                await ProductRepository.update(product.productId, { stock: product.stock - product.quantity });
            }

            
            const ticket = await TicketService.create({
                purchaser: req.user.email,
                amount: productsToBuy.reduce((acc, product) => acc + product.quantity * product.price, 0),
                products: productsToBuy
            });

            res.json({
                message: 'Purchase completed successfully',
                ticket,
                productsOutOfStock
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default CartController;
