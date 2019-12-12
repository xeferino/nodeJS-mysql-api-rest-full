const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin',new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done)  =>{
    const rows = await pool.query('SELECT id, name, email, password FROM users WHERE email = ?',[email]);
    if (rows.length>0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if (validPassword) {
            /* done(null, user, req.flash('success','Welcome '+user.name)); */
            done(null, user);
        }else {
            done(null, false, req.flash('message','Incorrect Password'));
        }
    }else {
        done(null, false, req.flash('message','The Email does not exists'));
    }
}));

passport.use('local.signup',new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done)  =>{
   const { name } = req.body;
   const newUser = {
        email,
        password,
        name
   };

   const result = await pool.query('SELECT email FROM users WHERE email = ?', [newUser.email]);
   if (result.length>0) {
       let row = result[0];
       console.log(row);
       return done(null, false, req.flash('message','The Email exists '+row.email));
   } else {
       newUser.password = await helpers.encryptPassword(password);
       const result = await pool.query('INSERT INTO users SET ?', [newUser]);
       newUser.id = result.insertId;
       return done(null, newUser);
       //return done(null, newUser, req.flash('success','Welcome '+newUser.name));
   } 
}));

passport.serializeUser((user, done) =>{
    done(null, user.id);
});

passport.deserializeUser(async (id, done) =>{
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
});