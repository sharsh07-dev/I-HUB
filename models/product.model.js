// models/product.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type:String, required: true },
    stock: { type: Number, required: true, default: 1 },
    model3DPath: { type: String, required: false },
    
    // --- ADD THIS LINE ---
    isFeatured: { type: Boolean, default: false } 
});

module.exports = mongoose.model('Product', productSchema);