const passport =require('passport');
const strategy = require('passport-local').Strategy;
const pool = require('../database');

passport.use('local.signup' , new strategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
},async (req,username,password,done)=>{
console.log(req.body);

}));

passport.serializeUser((user, done) => {
   // done(null, user.id);
  });