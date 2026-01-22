const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../../middlewares/authMiddleware');

router.get('/dashboard', ensureAuthenticated, (req, res) => {

    res.locals.title = 'Academia';
    res.locals.showSidebar = true;
    res.locals.user = req.session.user;

    res.render('dashboard/dashboard');
});

module.exports = router;