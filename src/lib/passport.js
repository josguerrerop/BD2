const passport =require('passport');
const strategy = require('passport-local').Strategy;
const db = require('../database');

passport.use('local.signup' , new strategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
},async (req,username,password,done)=>{
console.log(req.body);
const newClient = {
    username,
    password,
    fullname
};
try{
await db.query('insert into cliente  (m) (${id},${name})')

 }catch(error){
    console.log(error);
 }
}));

passport.serializeUser((user, done) => {
   // done(null, user.id);
  });