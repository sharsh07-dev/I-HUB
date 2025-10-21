// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user.model.js'); // Make sure .js is here

// --- Registration ---
// Show the registration page
router.get('/register', (req, res) => {
    res.render('register', { pageTitle: 'Register' });
});

// Handle the form submission
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // --- THIS IS THE FIX ---
        // 1. CHECK IF USER ALREADY EXISTS
        // We MUST 'await' this database call
        const existingUser = await User.findOne({ email: email });
        
        // 2. IF USER EXISTS, STOP AND REDIRECT
        if (existingUser) {
            console.log('User already exists.');
            // We should add an error message here later
            return res.redirect('/auth/register');
        }
        // --- END OF FIX ---

        // If we get here, the user is new.
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            email: email,
            password: hashedPassword
        });
        await user.save();
        res.redirect('/auth/login');

    } catch (err) {
        console.log(err);
        res.redirect('/auth/register');
    }
});

// --- Login ---
// Show the login page
router.get('/login', (req, res) => {
    res.render('login', { pageTitle: 'Login' });
});

// Handle the login form submission
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // --- THIS IS THE FIX ---
        // 1. FIND THE USER
        // We MUST 'await' this database call
        const user = await User.findOne({ email: email });

        // 2. IF NO USER, STOP AND REDIRECT
        if (!user) {
            console.log('No user found with that email.');
            return res.redirect('/auth/login');
        }

        // 3. CHECK PASSWORD
        // We MUST 'await' this comparison
        const isMatch = await bcrypt.compare(password, user.password);

        // 4. IF PASSWORD WRONG, STOP AND REDIRECT
        if (!isMatch) {
            console.log('Password incorrect.');
            return res.redirect('/auth/login');
        }
        // --- END OF FIX ---


        // --- SUCCESS! ---
        // If we get here, email and password are correct.
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(err => {
            if(err) console.log(err);
            res.redirect('/'); // Redirect to homepage
        });

    } catch (err) {
        console.log(err);
        res.redirect('/auth/login');
    }
});

// --- Logout ---
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) console.log(err);
        res.redirect('/');
    });
});

module.exports = router;