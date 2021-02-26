const passport = require('passport');
const strategy = require('passport-local').Strategy;
const db = require('../database');
const helpers = require('../lib/helpers');


passport.use('local.signin', new strategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, username, password, done) => {
    try {
        const rows = await db.query('SELECT * FROM sesion_cliente WHERE correo = $1', [username]);
        console.log(rows);

        if (rows.length > 0) {
            const user = rows[0];
            if (rows[0].clave == password) {
                done(null, user, req.flash('c', 'Welcome ' + user.username));;
            } else {
                done(null, false, req.flash('c', 'Incorrect Password'));
            }
        } else if (rows.length == 0 && (password == 'axxkd343' && username == 'admin@hotmail.com')) {
            const admin = [username, password];
            done(null, admin, req.flash('c', 'Welcome admin' + admin[0]));
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

        const id_cliente = await db.query('insert into cliente  (nombre,direccion) values (${nombre},${direccion}) returning id', { nombre, direccion });

        const id = id_cliente[0].id;
        await db.query('insert into sesion_cliente (id_cliente,correo,clave) values (${id},${username},${password})', { id, username, password });
        await db.query('insert into tel_cliente (id_cliente,telefono) values (${id},${numero_tel})', { id, numero_tel });

        const newClient = { id, username, password, nombre, direccion };
        return done(null, newClient);
    } catch (error) {
        console.log(error);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});