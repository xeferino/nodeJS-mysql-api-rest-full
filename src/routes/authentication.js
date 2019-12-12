const { Router } = require('express');
const router = Router();
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('auth/signup');
});

router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin');
});

router.post('/signup', isNotLoggedIn, (req, res, next) => {
    if(!req.body.email ) {
        req.flash('message', 'The Email is Requerid');
        res.redirect('/api-weapons/signup');
    }else if(!req.body.password ) {
        req.flash('message', 'The Password is Requerid');
        res.redirect('/api-weapons/signup');
    }else if(!req.body.name ) {
        req.flash('message', 'The Name is Requerid');
        res.redirect('/api-weapons/signup');
    }else{
        passport.authenticate('local.signup', {
            successRedirect: '/api-weapons/profile',
            failureRedirect: '/api-weapons/signup',
            failureFlash: true
        })(req, res, next);
    }
});

router.post('/signin', isNotLoggedIn, (req, res, next) =>{
    if(!req.body.email ){
        req.flash('message', 'The Email is Requerid');
        res.redirect('/api-weapons/signin');
    }else if(!req.body.password ){
        req.flash('message', 'The Password is Requerid');
        res.redirect('/api-weapons/signin');
    }else {
        passport.authenticate('local.signin', {
            successRedirect: '/api-weapons/profile',
            failureRedirect: '/api-weapons/signin',
            failureFlash: true
        })(req, res, next);
    }
});

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile');
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/api-weapons/signin');
});

module.exports = router;