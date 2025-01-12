import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true },
    }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });


const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

export default Cart;

