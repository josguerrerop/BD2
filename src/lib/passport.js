const passport =require('passport');
const strategy = require('passport-local').Strategy;
const db = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signup' , new strategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
},async (req,username,password,done)=>{

   
    const {nombre,direccion} = req.body;
  
     //console.log(newClient);
try{
 const result =await db.query('insert into cliente  (nombre,direccion) values (${nombre},${direccion})',{direccion,nombre});
 await db.query('insert into sesion_cliente (correo,clave) values (${username},${password})',{username,password});
const newClient = {direccion,nombre,username,password};

const id = await db.query('select id_cliente from sesion_cliente where correo = $1',username);
var i = id[0];
newClient.id=i.id_cliente;
 return done(null,newClient);
}catch(error){
    console.log(error);
 }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM sesion_cliente WHERE id = ?', [id]);
    console.log(rows);
    done(null, rows[0]);
  });