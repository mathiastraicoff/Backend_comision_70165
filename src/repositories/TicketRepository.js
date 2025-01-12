class TicketRepository {
    constructor(ticketModel) {
        this.ticketModel = ticketModel;
    }

    async create(ticketData) {
        try {
            const ticket = new this.ticketModel(ticketData);
            return await ticket.save();
        } catch (error) {
            throw new Error('Error creating ticket: ' + error.message);
        }
    }
}

export default TicketRepository;

