const express = require("express");
const { as } = require("pg-promise");
const router = express.Router();
const db = require("../database");
const { route } = require("./links");

router.get("/registrar-prov", async(req, res) => {
    res.render("admin/prov");
});

//
router.get("/registrar-vend", async(req, res) => {
    res.render("admin/vendedor");
});

router.post("/registrar-vend/add", async(req, res) => {
    try {
        const { nombre } = req.body;
        const rep = await db.query(
            `insert into vendedor (nombre) values ('${nombre}')`
        );
        req.flash("c", "Vendedor anadido correctamente");
        req.session.save(function() {
            res.redirect("/registrar-vend");
        });
    } catch (error) {
        console.log(error);
    }
});
//

router.post("/registrar-prov/add", async(req, res) => {
    try {
        const { direccion, nombre, representante, contacto } = req.body;
        const id_p = await db.query(
            `insert into proveedor (direccion, nombre, persona_contacto) values ('${direccion}', '${nombre}', '${representante}') returning id`
        );
        const idp = id_p[0].id;
        console.log(idp);

        const resp1 = await db.query(
            `insert into tel_proveedor (id_proveedor,telefono) values ('${idp}','${contacto}')`
        );
        req.flash("c", "Proveedor añadido correctamente");
        res.redirect("/registrar-prov");
    } catch (error) {
        console.log(error);
    }
});

//

router.get("/add", (req, res) => {
    res.render("admin/add");
});

router.post("/add", async(req, res) => {
    const { id, name } = req.body;
    const link = { id, name };
    try {
        await db.query(
            "INSERT INTO material (id,material) values (${id},${name})",
            link
        );
        req.flash("c", "xddd");
        req.session.save(function() {
            res.redirect("/add");
        });
    } catch (error) {
        console.log(error);
    }
});

//

//
router.get("/reporte", async(req, res) => {
    const repo_mueble = await db.query("select * from cant_mueble_vend;");
    const repo_vendedor = await db.query("select * from cant_ventas_vendedor;");
    const repo_cliente = await db.query("select * from cantm_client_compra;");
    res.render("admin/reporte", { repo_mueble, repo_vendedor, repo_cliente });
});
//

//REGISTRO DE MUEBLES
router.get("/registromuebles", async(req, res) => {
    const user = req.user;
    console.log(user);
    if (user[0] == "admin@hotmail.com" && user[1] == "axxkd343") {
        try {
            var material = await db.query("select * from material;");
            const color = await db.query("select * from color;");
            const tipo = await db.query("select * from tipo_mueble;");
            const vendedor = await db.query("select * from vendedor;");
            const proveedor = await db.query("select * from proveedor;");
            res.render("admin/registromuebles", {
                material,
                color,
                tipo,
                vendedor,
                proveedor,
            });
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect("/links/home");
    }
});

router.post("/registromuebles/add", async(req, res) => {
    try {
        const {
            precio,
            alto,
            ancho,
            profundo,
            instalacion,
            material,
            color,
            tipo,
            vendedor,
            proveedor,
        } = req.body;
        const resp = await db.query(
            `insert into mueble (precio, dimensiones, precio_instalacion, id_color, id_tipo_mueble, id_material, id_vendedor, id_proveedor) values (${precio}, '${alto},${ancho},${profundo}', ${instalacion}, ${color} , ${tipo}, ${material}, ${vendedor}, ${proveedor})`
        );
        req.flash("c", "Mueble anadido correctamente");
        res.redirect("/registromuebles");
    } catch (error) {
        console.log(error);
    }
});

router.get("/mueble_Admin", async(req, res) => {
    const muebles = await db.query("select * from vista_mueble;");
    res.render("admin/AdminMueble", { muebles });
});

router.get("/borrar/:id", async(req, res) => {
    try {
        id = req.params.id;
        const sql = db.query(`DELETE FROM mueble WHERE id=${id}`);
        req.flash("c", "Mueble eliminado correctamente");
        res.redirect("/admin/mueble_Admin");
    } catch (error) {
        console.log(error);
        req.flash("c", "El mueble no se pudo eliminar");
        res.redirect("/admin/mueble_Admin");
    }
});
router.get("/editar/:id", async(req, res) => {
    try {
        id = req.params.id;
        const material = await db.query("select * from material;");
        const color = await db.query("select * from color;");
        const tipo = await db.query("select * from tipo_mueble;");
        const vendedor = await db.query("select * from vendedor;");
        const proveedor = await db.query("select * from proveedor;");
        const mueble = await db.query(`SELECT * FROM vista_mueble WHERE id=${id};`);
        res.render("admin/editarMue", {
            mueble,
            material,
            color,
            tipo,
            vendedor,
            proveedor,
            mueble,
        });
    } catch (error) {
        console.log(error);
    }
});

router.post("/editar", async(req, res) => {
    const {
        id,
        precio,
        alto,
        ancho,
        profundo,
        instalacion,
        material,
        color,
        tipo,
        vendedor,
        proveedor,
    } = req.body;
    try {
        const rep = await db.query(
            `update mueble set precio=${precio}, precio_instalacion=${instalacion}, dimensiones='${alto},${ancho},${profundo}', id_proveedor=${proveedor}, id_vendedor=${vendedor}, id_color=${color}, id_tipo_mueble=${tipo}, id_material=${material} where id=${id}`
        );
        res.redirect("/mueble_Admin");
    } catch (error) {
        console.log(error);
    }
});
///////////////////////////////////////////////////////////////////////////////////////////

router.post("/registrar-color/add", async(req, res) => {
    const { nombre } = req.body;
    try {
        const rep = await db.query(
            `insert into color (color) values ('${nombre}')`
        );
        req.flash("c", "Color anadido correctamente");
        req.session.save(function() {
            res.redirect("/colores");
        });
    } catch (error) {
        console.log(error);
    }
});
router.get("/editar-color/:id", async(req, res) => {
    try {
        const id = req.params.id;
        console.log(id);
        const row = await db.query(`select * from color where id=${id};`);
        res.render("admin/editColor", { row });
    } catch (error) {
        console.log(error);
    }
});

router.post("/editar-color/add", async(req, res) => {
    const { id, color } = req.body
    try {
        const sql = await db.query(`update color set color ='${color}' where id=${id};`)
        res.redirect('/colores')
    } catch (error) {
        console.log(error);
    }
});

//////////////////////////////////////////////////////////////////////////////////////////////

router.post("/registrar-material/add", async(req, res) => {
    const { nombre } = req.body;
    try {
        const rep = await db.query(
            `insert into material (material) values ('${nombre}')`
        );
        req.flash("c", "Material anadido correctamente");
        req.session.save(function() {
            res.redirect("/materiales");
        });
    } catch (error) {
        console.log(error);
    }
});
router.get("/registrar-material", async(req, res) => {
    res.render("admin/regisMaterial");
});
router.get("/editar-material/:id", async(req, res) => {
    try {
        const id = req.params.id;
        const row = await db.query(`select * from material where id=${id};`);
        res.render("admin/editMaterial", { row });
    } catch (error) {
        console.log(error);
    }
});

router.post("/editar-material/add", async(req, res) => {
    const { id, material } = req.body
    try {
        const sql = await db.query(`update material set material ='${material}' where id=${id};`)
        res.redirect('/materiales')
    } catch (error) {
        console.log(error);
    }
});
//////////////////////////////////////////////////////////////////////////////

router.post("/registrar-tipo/add", async(req, res) => {
    const { nombre } = req.body;
    try {
        const rep = await db.query(
            `insert into tipo_mueble (tipo) values ('${nombre}')`
        );
        req.flash("c", "Tipo anadido correctamente");
        req.session.save(function() {
            res.redirect("/tipos");
        });
    } catch (error) {
        console.log(error);
    }
});

router.get("/registrar-tipo", async(req, res) => {
    res.render("admin/regisTipo");
});


router.get("/registrar-color", async(req, res) => {
    res.render("admin/regisColor");
});

router.get("/editar-tipo/:id", async(req, res) => {
    try {
        const id = req.params.id;
        const row = await db.query(`select * from tipo_mueble where id=${id};`);
        res.render("admin/editTipo", { row });
    } catch (error) {
        console.log(error);
    }
});

router.post("/editar-tipo/add", async(req, res) => {
    const { id, tipo } = req.body
    try {
        const sql = await db.query(`update tipo_mueble set tipo ='${tipo}' where id=${id};`)
        res.redirect('/tipos')
    } catch (error) {
        console.log(error);
    }
});
/////////////////////////////////////////////////////////////////////////////
router.get("/colores", async(req, res) => {
    const colores = await db.query("select * from color;");
    res.render("admin/color", { colores });
});

router.get("/materiales", async(req, res) => {
    const materiales = await db.query("select * from material;");
    res.render("admin/material", { materiales });
});

router.get("/tipos", async(req, res) => {
    const tipos = await db.query("select * from tipo_mueble;");
    res.render("admin/tipos", { tipos });
});

module.exports = router;