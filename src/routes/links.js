const express = require('express');
const { as } = require('pg-promise');
const { func } = require('../database');
const router = express.Router();
const db = require('../database');

//CUANDO EL CLIENTE COMPRA CAPTURAMOS SU

router.get('/comprar/:id', async(req, res) => {
    if (req.user) {
        console.log('entring')
    } else {
        res.redirect('/signin');
    }
});

//PAGINA DE MUEBLES DE INICIO
router.get('/home', async(req, res) => {
    const muebles = await db.query('select mueble.id, id_proveedor, id_vendedor, precio, dimensiones, precio_instalacion, id_color, id_tipo_mueble, id_material, color, material, tipo, proveedor.nombre as nombre_prov, vendedor.nombre as nombre_vend from mueble inner join color on mueble.id_color = color.id inner join material on mueble.id_material =material.id inner join tipo_mueble on mueble.id_tipo_mueble = tipo_mueble.id inner join proveedor  on mueble.id_proveedor = proveedor.id inner join vendedor on mueble.id_vendedor = vendedor.id');

    res.render('links/home', { muebles });
});


//REGISTRO DE MUEBLES
router.get('/registromuebles', async(req, res) => {
    try {
        var material = await db.query('select * from material;');
        const color = await db.query('select * from color;');
        const tipo = await db.query('select * from tipo_mueble;');
        const vendedor = await db.query('select * from vendedor;');
        const proveedor = await db.query('select * from proveedor;');
        res.render('links/registromuebles', { material, color, tipo, vendedor, proveedor });
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
});

router.get('/registrar-prov', async(req, res) => {
    res.render('links/prov');
})



router.post('/registrar-prov/add', async(req, res) => {
    try {
        const { direccion, nombre, representante, contacto } = req.body;
        const id_p = await db.query(`insert into proveedor (direccion, nombre, persona_contacto) values ('${direccion}', '${nombre}', '${representante}') returning id`);
        const idp = id_p[0].id;
        console.log(idp)

        const resp1 = await db.query(`insert into tel_proveedor (id_proveedor,telefono) values ('${idp}','${contacto}')`);
        req.flash('c', 'Proveedor añadido correctamente');
        res.redirect('/links/registrar-prov');
    } catch (error) {
        console.log(error);
    }
});

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
});


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