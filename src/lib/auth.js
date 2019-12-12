module.exports = {
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }else {
            res.redirect('/api-weapons/signin');
        }
    },
    isNotLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }else {
            res.redirect('/api-weapons/profile');
        }
    }
};