const express = require('express');
const { as } = require('pg-promise');
const { func } = require('../database');
const router = express.Router();
const db = require('../database');
//const pg = db.connect();


router.get('/home', async(req, res) => {
    res.render('links/home');
});
router.get('/take', async(req, res) => {
    try {
        var material = await db.query('select * from material;');
        const color = await db.query('select * from color;');
        const tipo = await db.query('select * from tipo_mueble;');
        const vendedor = await db.query('select * from vendedor;');
        const proveedor = await db.query('select * from proveedor;');
        res.render('links/take', { material, color, tipo, vendedor, proveedor });
    } catch (error) {
        console.log(error);
    }
});

router.post('/take/add', async(req, res) => {
    try {
        console.log('entrotake');
        const { precio, dimensiones, instalacion, material, color, tipo, vendedor, proveedor } = req.body;
        const resp = await db.query(`insert into mueble (precio, dimensiones, cant_comprados, precio_instalacion, id_color, id_tipo_mueble, id_material, id_vendedor, id_proveedor) values (${precio}, '${dimensiones}', 0, ${instalacion}, ${color} , ${tipo}, ${material}, ${vendedor}, ${proveedor})`);
        req.flash('c', 'Mueble anadido correctamente');
        res.redirect('/links/take');
    } catch (error) {
        console.log(error);
    }
})

router.get('/registrar-prov', async(req, res) => {
    res.render('links/prov');
})

router.post('/registrar-prov/add', async(req, res) => {
    try {

        const { direccion, nombre, representante, contacto } = req.body;
        const resp = await db.query(`insert into proveedor (direccion, nombre, persona_contacto) values ('${direccion}', '${nombre}', '${representante}')`);
        const resp1 = await db.query(`insert into tel_proveedor (telefono) values ('${contacto}')`);
        req.flash('c', 'Proveedor anadido correctamente');
        res.redirect('/links/registrar-prov');
    } catch (error) {
        console.log(error);
    }

})

router.get('/registrar-vend', async(req, res) => {
    res.render('links/vendedor');
});

router.post('/registrar-vend/add', async(req, res) => {
    try {
        const { nombre } = req.body;
        const rep = await db.query(`insert into vendedor (nombre, numero_ventas) values ('${nombre}', 0)`);
        req.flash('c', 'Vendedor anadido correctamente');
        req.session.save(function() {
        res.redirect('/links/registrar-vend');
    });
    } catch (error) {
        console.log(error);
    }
})


router.get('/add', (req, res) => {
    res.render('links/add');
});

router.get('/xd', async(req, res) => {
    req.flash('c', 'hello');
    req.session.save(function() {
        res.redirect('/links/take');
    });

});


router.post('/add', async(req, res) => {
    const { id, name } = req.body;
    const link = { id, name };
    try {
        await db.query('INSERT INTO material (id,material) values (${id},${name})', link);
        req.flash('c', 'xddd');
        req.session.save(function() {
            res.redirect('/links/take');
        });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;