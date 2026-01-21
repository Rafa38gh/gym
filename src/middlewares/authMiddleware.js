function ensureAuthenticated(req, res, next) {
    if(!req.session || !req.session.user) {
        return res.redirect('/login');
    }

    next();
}

function ensureGuest(req, res, next) {
    if(req.session?.user) {
        return res.redirect('/dashboard');
    }

    next();
}

module.exports = {
    ensureAuthenticated,
    ensureGuest
};