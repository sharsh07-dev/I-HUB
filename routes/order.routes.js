// routes/order.routes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/order.model.js');
const Product = require('../models/product.model.js'); // To update stock

// --- Middleware to check if user is logged in ---
// This makes the route "protected"
const isAuth = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        // If not logged in, send them to the login page
        return res.redirect('/auth/login');
    }
    next();
};

// --- Create an Order ---
// This route matches the form action: action="/order/create"
router.post('/create', isAuth, async (req, res) => {
    try {
        const cart = req.session.cart;

        if (!cart || cart.items.length === 0) {
            return res.redirect('/cart');
        }

        // 1. Create the new order in the database
        const order = new Order({
            user: req.session.user._id, // From the logged-in user
            products: cart.items.map(item => ({
                productData: item.product,
                quantity: item.quantity
            })),
            totalAmount: cart.total
        });
        await order.save();

        // 2. (Optional but important) Decrease stock
        for (const item of cart.items) {
            await Product.updateOne(
                { _id: item.product._id },
                { $inc: { stock: -item.quantity } }
            );
        }

        // 3. Clear the user's cart
        req.session.cart = { items: [], total: 0 };
        await req.session.save();

        // 4. Send them to the "Thank You" page
        res.render('order-confirmation', {
            pageTitle: 'Order Confirmed!',
            order: order
        });

    } catch (err) {
        console.log(err);
    }
});

module.exports = router;