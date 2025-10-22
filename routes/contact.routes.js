const express = require('express');
const router = express.Router();
const Contact = require('../models/contact.model.js'); // Import the new model

// GET: Show the contact page
router.get('/', (req, res) => {
    // We pass an empty 'message' so the page doesn't crash on first load
    res.render('contact', { 
        pageTitle: 'Contact Us', 
        message: {} // No success/error message yet
    });
});

// POST: Handle the form submission
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        const newInquiry = new Contact({
            name: name,
            email: email,
            message: message
        });

        // Save it to the database
        await newInquiry.save();

        // Send them back to the contact page with a success message
        res.render('contact', {
            pageTitle: 'Contact Us',
            message: { type: 'success', text: 'Message sent! We will get back to you soon.' }
        });

    } catch (err) {
        console.log(err);
        // If an error happens, send them back with an error message
        res.render('contact', {
            pageTitle: 'Contact Us',
            message: { type: 'error', text: 'Something went wrong. Please try again.' }
        });
    }
});

module.exports = router;