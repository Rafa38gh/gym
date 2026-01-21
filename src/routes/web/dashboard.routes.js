const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../../middlewares/authMiddleware');

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard/dashboard', { user: req.session.user });
});

module.exports = router;