const express = require('express');
//const { as } = require('pg-promise');
const router = express.Router();
const db = require('../database');


router.post('/comprar', async(req, res) => {
    if (req.user) {
        const { valorCompra, id_mueble } = req.body;
        const id = req.user.id_cliente;
        const valor = parseInt(valorCompra);
        const idM = parseInt(id_mueble);
        try {
            await db.query(`insert into compra (id_mueble,id_cliente,fecha,valor)
              values ('${idM}','${id}',to_timestamp(${Date.now()} / 1000.0),'${valor}')`);
            res.redirect('/links/home');
            req.flash('c', 'Mueble comprado');
        } catch (error) {
            console.log(error);
        }

    } else {
        res.redirect('/signin');
    }

});



//PAGINA DE MUEBLES DE INICIO
router.get('/home', async(req, res) => {
    const muebles = await db.query('select * from vista_mueble;');
    res.render('links/home', { muebles });
});

router.get('/Mis-Compras', async(req, res) => {
    if (req.user) {
        const id = req.user.id_cliente;
        compras = await db.query(`select * from Compras where id_cliente =${id};`);
        res.render('links/compras', { compras })
    } else {
        res.redirect('links/home')
    }
})





module.exports = router;