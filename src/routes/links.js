const express = require('express');
const { as } = require('pg-promise');
const { func } = require('../database');
const router = express.Router();
const db = require('../database');
//const pg = db.connect();



router.get('/take', async(req, res) => {
    try {
        var material = await db.query('select * from material');
        const color = await db.query('select * from color;');
        const tipo = await db.query('select * from tipo_mueble');
        const vendedor = await db.query('select * from vendedor');
        const proveedor = await db.query('select * from proveedor');
        res.render('links/take', { material, color, tipo, vendedor, proveedor });
    } catch (error) {
        console.log(error);
    }
});

router.get('/add', (req, res) => {
    res.render('links/add');
});

router.get('/xd', async(req, res) => {
    req.flash('c', 'xddd');
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