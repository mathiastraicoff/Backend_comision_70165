import TicketService from '../service/TicketManager.js';

class PurchaseController {
    async createTicket(req, res) {
        try {
            const { products, purchaser, amount } = req.body;
            const ticket = await TicketService.create({ products, purchaser, amount });
            return res.status(201).json(ticket);
        } catch (error) {
            res.status(500).json({ message: 'Error creating ticket' });
        }
    }
}

export default PurchaseController;

