// routes/product.routes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');

// --- Get All Products ---
// Page: /products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find(); // Get all products from DB
        res.render('products', {
            pageTitle: 'All Products',
            products: products // Pass the products to the EJS file
        });
    } catch (err) {
        console.log(err);
    }
});

// --- Get Single Product Details ---
// Page: /products/some-id-123
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.render('product-detail', {
            pageTitle: product.name,
            product: product // Pass the single product
        });
    } catch (err) {
        console.log(err);
    }
});
module.exports = router;