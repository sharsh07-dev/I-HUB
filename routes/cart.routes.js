// routes/cart.routes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');

// --- Show the Cart Page ---
// Page: /cart
router.get('/', (req, res) => {
    // The cart lives in req.session.cart
    // res.locals.cart is already available in all views
    res.render('cart', {
        pageTitle: 'Your Cart'
    });
});

// --- Add Item to Cart ---
router.post('/add', async (req, res) => {
    const { productId, quantity } = req.body;
    
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.redirect('/products');
        }

        // Initialize cart if it doesn't exist
        if (!req.session.cart) {
            req.session.cart = { items: [], total: 0 };
        }

        const cart = req.session.cart;

        // Check if product is already in cart
        const existingItemIndex = cart.items.findIndex(item => item.product._id.toString() === productId);

        if (existingItemIndex > -1) {
            // Product already in cart, update quantity
            cart.items[existingItemIndex].quantity += parseInt(quantity, 10);
        } else {
            // Add new product to cart
            cart.items.push({
                product: product, // Store the full product object
                quantity: parseInt(quantity, 10)
            });
        }

        // Recalculate total price
        cart.total = cart.items.reduce((acc, item) => {
            return acc + (item.product.price * item.quantity);
        }, 0);

        req.session.save(err => {
            if(err) console.log(err);
            res.redirect('/cart');
        });

    } catch (err) {
        console.log(err);
    }
});

// --- Remove Item from Cart ---
router.post('/remove/:productId', (req, res) => {
    const productId = req.params.productId;
    const cart = req.session.cart;

    if (cart) {
        // Filter out the item to remove
        cart.items = cart.items.filter(item => item.product._id.toString() !== productId);

        // Recalculate total
        cart.total = cart.items.reduce((acc, item) => {
            return acc + (item.product.price * item.quantity);
        }, 0);

        req.session.save(err => {
            if(err) console.log(err);
            res.redirect('/cart');
        });
    } else {
        res.redirect('/cart');
    }
});
module.exports = router;