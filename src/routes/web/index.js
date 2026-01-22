const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require('../../middlewares/authMiddleware');

const dashboardRoutes = require('./dashboard.routes');

// Home page
router.get('/', (req, res) => {
    res.render('index', { 
        title: 'Academia',
        showSidebar: true
    });
});


// Autenticação
router.get('/register', ensureGuest, (req, res) => {
    res.render('auth/register', {
        title: 'Academia',
        showSidebar: false
    });
});

router.get('/login', ensureGuest, (req, res) => {
    res.render('auth/login', {
        title: 'Academia',
        showSidebar: false
    });
});


// Dashboard
router.use(dashboardRoutes);

module.exports = router;