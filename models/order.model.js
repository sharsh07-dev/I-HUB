// models/order.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    // Link to the user who made the order
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // An array of product objects
    products: [
        {
            productData: { type: Object, required: true },
            quantity: { type: Number, required: true }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'Processing' // e.g., "Processing", "Shipped", "Delivered"
    },
    orderDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);