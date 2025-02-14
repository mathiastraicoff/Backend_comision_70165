import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    products: [{
        productId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product', 
            required: true 
        },
        quantity: { 
            type: Number, 
            required: true,
            min: 1
        }
    }],
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
