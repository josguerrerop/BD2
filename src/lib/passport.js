const passport = require('passport');
const strategy = require('passport-local').Strategy;
const db = require('../database');
const helpers = require('./helpers');


passport.use('local.signin', new strategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, username, password, done) => {
    try {
        const rows = await db.query('SELECT * FROM sesion_cliente WHERE correo = $1', [username]);
        if (rows.length > 0) {
            const user = rows[0];
            const validPassword = await helpers.matchPassword(password, user.clave);
            if (validPassword) {
                done(null, user, req.flash('c', 'Welcome ' + user.correo));
            } else {
                done(null, false, req.flash('c', 'Incorrect Password'));
            }
        } else {
            return done(null, false, req.flash('c', 'The Username does not exists.'));
        }


    } catch (e) { console.log(e) }
}));



passport.use('local.signup', new strategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, username, password, done) => {
    const { nombre, direccion, numero_tel } = req.body;
    try {

        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1;
        var year = dateObj.getUTCFullYear();
        newdate = year + "-" + "0" + month;

        const id = await db.query('insert into cliente  (nombre,direccion, fecha_registro) values (${nombre},${direccion},${newdate}) returning id', { nombre, direccion, newdate });
        const id_cliente = id[0].id;


        await db.query('insert into tel_cliente (id_cliente,telefono) values (${id_cliente},${numero_tel})', { id_cliente, numero_tel, newdate });
        password = await helpers.encryptPassword(password);
        await db.query('insert into sesion_cliente (id_cliente,correo,clave) values (${id_cliente},${username},${password})', { id_cliente, username, password });
        const correo = username;
        const newClient = { id_cliente, correo, password, nombre, direccion };
        return done(null, newClient);
    } catch (error) {
        console.log(error);
    }
}));


passport.serializeUser(function(user, done) {
    done(null, user.id_cliente);
});

passport.deserializeUser(async(id_cliente, done) => {
    const rows = await db.query('SELECT * FROM sesion_cliente WHERE id_cliente = $1', [id_cliente]);
    done(null, rows[0]);
});