import Ticket from '../models/ticket.js';  

class TicketManager {
    // Método para crear un ticket
    async createTicket(cart, purchaserEmail) {
        // Validar si el carrito tiene productos
        if (!cart.products || cart.products.length === 0) {
            throw new Error('El carrito está vacío, no se puede generar un ticket.');
        }

        // Calcular el total de la compra
        let totalAmount = 0;
        cart.products.forEach(product => {
            totalAmount += product.quantity * product.price;
        });

        // Crear el código único para el ticket
        const ticketCode = `TCK-${Date.now()}`;

        // Crear el ticket
        const ticket = new Ticket({
            code: ticketCode,
            purchase_datetime: new Date(),
            amount: totalAmount,
            purchaser: purchaserEmail,
        });

        // Guardar el ticket en la base de datos
        try {
            const savedTicket = await ticket.save();
            return savedTicket;
        } catch (error) {
            throw new Error('Error al guardar el ticket: ' + error.message);
        }
    }

    // Método para encontrar un ticket por su código
    async getTicketByCode(code) {
        try {
            const ticket = await Ticket.findOne({ code });
            if (!ticket) {
                throw new Error('Ticket no encontrado');
            }
            return ticket;
        } catch (error) {
            throw new Error('Error al buscar el ticket: ' + error.message);
        }
    }
}

export default new TicketManager();
