const express = require('express');
const { as } = require('pg-promise');
const router = express.Router();
const db = require('../database');
const { route } = require('./links');

router.get('/mueble_Admin', async(req, res) => {
    const muebles = await db.query('select * from vista_mueble;');
    res.render('admin/AdminMueble', { muebles });
});

router.get('/borrar/:id', async(req, res) => {
    try {
        id = req.params.id
        const sql = db.query(`DELETE FROM mueble WHERE id=${id}`)
        req.flash('c', 'Mueble eliminado correctamente')
        res.redirect('/admin/mueble_Admin')
    } catch (error) {
        console.log(error);
        req.flash('c', 'El mueble no se pudo eliminar')
        res.redirect('/admin/mueble_Admin')
    }
})
router.get('/editar/:id', async(req, res) => {
    try {
        id = req.params.id
        const material = await db.query('select * from material;')
        const color = await db.query('select * from color;')
        const tipo = await db.query('select * from tipo_mueble;')
        const vendedor = await db.query('select * from vendedor;')
        const proveedor = await db.query('select * from proveedor;')
        const mueble = await db.query(`SELECT * FROM vista_mueble WHERE id=${id};`)
        res.render('admin/editarMue', { mueble, material, color, tipo, vendedor, proveedor, mueble })
    } catch (error) {
        console.log(error);
    }
})

router.post('/editar', async(req, res) => {
    const { id, precio, alto, ancho, profundo, instalacion, material, color, tipo, vendedor, proveedor } = req.body;
    try {
        const rep = await db.query(`update mueble set precio=${precio}, precio_instalacion=${instalacion}, dimensiones='${alto},${ancho},${profundo}', id_proveedor=${proveedor}, id_vendedor=${vendedor}, id_color=${color}, id_tipo_mueble=${tipo}, id_material=${material} where id=${id}`)
        res.redirect('/admin/mueble_Admin')
    } catch (error) {
        console.log(error)
    }
})



module.exports = router;