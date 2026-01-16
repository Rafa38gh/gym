const express = require('express');
const router = express.Router();

// Home page
router.get('/', (req, res) => {
    res.render('index', { title: 'Academia'});
});


// Autenticação
router.get('/register', (req, res) => {
    res.render('auth/register');
});

router.get('/login', (req, res) => {
    res.render('auth/login');
});


// Dashboard
router.get('/dashboard', (req, res) => {
    if(!req.session.user) {
        return res.redirect('/login');
    }

    res.render('dashboard/dashboard', { user: req.session.user });
});

module.exports = router;