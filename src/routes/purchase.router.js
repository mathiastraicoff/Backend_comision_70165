import { Router } from 'express';
import PurchaseController from '../controllers/purchase.controller.js';
import authenticateToken from "../middleware/authenticateToken.js";

const router = Router();
const purchaseController = new PurchaseController();

router.post('/:cartId', authenticateToken, async (req, res) => {
    try {
        const { cartId } = req.params;
        const { purchaser } = req.body; 
        
        if (!purchaser) {
            return res.status(400).json({ status: 'error', message: 'Debe proporcionar un comprador' });
        }

        const purchaseDetails = await purchaseController.finalizePurchase(cartId, purchaser);
        
        res.status(201).json({
            status: 'success',
            message: 'Compra finalizada con éxito',
            purchaseDetails,
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;
