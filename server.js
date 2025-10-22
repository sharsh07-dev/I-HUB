// server.js
require('dotenv').config(); // Loads the .env file secrets
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');

// Import your route files
const authRoutes = require('./routes/auth.routes.js');
const productRoutes = require('./routes/product.routes.js');
const cartRoutes = require('./routes/cart.routes.js');
const Product = require('./models/product.model.js');
const orderRoutes = require('./routes/order.routes.js');
const contactRoutes = require('./routes/contact.routes.js');
const app = express();
const PORT = process.env.PORT || 3000;

// 1. Connect to MongoDB
// Tell Express where to find static files (CSS, images, client-side JS)
app.use(express.static(path.join(__dirname, 'public')));
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// 2. Set up Middleware
// Tell Express where to find static files (CSS, images, client-side JS)
console.log({ authRoutes, productRoutes, cartRoutes, orderRoutes });
app.use(express.static(path.join(__dirname, 'public')));
// Allow Express to read form data
app.use(express.urlencoded({ extended: true }));
// Allow Express to read JSON data
app.use(express.json());

// 3. Set up Session
// 3. Set up Session
app.use(session({
  secret: process.env.SESSION_SECRET, // Uses your .env file
  resave: false,
  saveUninitialized: true
}));

// 4. Set View Engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 5. Global variables for all templates
// This makes `cart` and `isAuthenticated` available in all your .ejs files
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn || false;
    res.locals.cart = req.session.cart || { items: [] };
    res.locals.user = req.session.user || null;
    next();
});

// 6. Use Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/order', orderRoutes);
app.use('/contact', contactRoutes);

// Homepage Route
// Homepage Route
// Homepage Route
// Homepage Route
// Homepage Route
app.get('/', async (req, res) => {
    try {
        // Find products where isFeatured is true, and limit it to 4
        const featuredProducts = await Product.find({ isFeatured: true }).limit(4);

        res.render('index', { 
            pageTitle: 'Home',
            products: featuredProducts // This 'products' variable is what was missing
        });
    } catch (err) {
        console.log(err);
        // If it fails, still load the page but with an empty products array
        res.render('index', { pageTitle: 'Home', products: [] });
    }
});
// 7. Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

