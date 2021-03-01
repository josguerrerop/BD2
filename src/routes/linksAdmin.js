const express = require("express");
const { as } = require("pg-promise");
const router = express.Router();
const db = require("../database");
const { route } = require("./links");


function evalAdmin(user) {
    if (user) {
        if (user.correo == "admin@hotmail.com") {
            return true;
        }
    }
    return false;
}


router.get("/inicio", async(req, res) => {
    if (evalAdmin(req.user)) {
        req.session.save(function() {
            req.flash('c', 'Administrador');
            res.render("admin/homa");
        });
    } else {
        res.redirect('/links/home');
    }
});


router.get("/registrar-prov", async(req, res) => {
    if (evalAdmin(req.user)) {

        res.render("admin/prov");
    } else {
        res.redirect('/links/home');
    }
});

//
router.get("/registrar-vend", async(req, res) => {
    if (evalAdmin(req.user)) {
        res.render("admin/vendedor");
    } else {
        res.redirect('/links/home');
    }
});

router.post("/registrar-vend/add", async(req, res) => {
    if (evalAdmin(req.user)) {
        try {
            const { nombre } = req.body;
            const rep = await db.query(
                `insert into vendedor (nombre) values ('${nombre}')`
            );
            req.flash("c", "Vendedor anadido correctamente");
            req.session.save(function() {
                res.redirect("/vendedores");
            });
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect('/links/home');
    }
});
//

router.post("/registrar-prov/add", async(req, res) => {
    if (evalAdmin(req.user)) {
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
            res.redirect("/proveedores");
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect('/links/home');
    }
});

//

router.get("/add", (req, res) => {
    if (evalAdmin(req.user)) {
        res.render("admin/add");
    } else {
        res.redirect('/links/home');
    }
});

router.post("/add", async(req, res) => {
    if (evalAdmin(req.user)) {
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
    } else {
        res.redirect('/links/home');
    }
});

//

//
router.get("/reporte", async(req, res) => {
    if (evalAdmin(req.user)) {
        const repo_nuevos = await db.query("select * from clientes_nuevos();");
        const repo_mueble = await db.query("select * from reporte_mueble();");
        const repo_vendedor = await db.query("select * from reporte_vendedor();");
        const repo_cliente = await db.query("select * from reporte_cliente();");
        res.render("admin/reporte", { repo_mueble, repo_vendedor, repo_cliente, repo_nuevos });
    } else {
        res.redirect('/links/home');
    }
});
//

//REGISTRO DE MUEBLES
router.get("/registromuebles", async(req, res) => {
    if (evalAdmin(req.user)) {
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
        res.redirect('/links/home');
    }
});

router.post("/registromuebles/add", async(req, res) => {
    if (evalAdmin(req.user)) {
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
    } else {
        res.redirect('/links/home');
    }
});

router.get("/mueble_Admin", async(req, res) => {
    if (evalAdmin(req.user)) {
        const muebles = await db.query("select * from vista_mueble;");
        res.render("admin/AdminMueble", { muebles });
    } else {
        res.redirect('/links/home');
    }
});

router.get("/borrar/:id", async(req, res) => {
    if (evalAdmin(req.user)) {
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
    } else {
        res.redirect('/links/home');
    }
});
router.get("/editar/:id", async(req, res) => {
    if (evalAdmin(req.user)) {
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
    } else {
        res.redirect('/links/home');
    }
});

router.post("/editar", async(req, res) => {
    if (evalAdmin(req.user)) {
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
    } else {
        res.redirect('/links/home');
    }
});
///////////////////////////////////////////////////////////////////////////////////////////

router.get("/registrar-color", async(req, res) => {
    if (evalAdmin(req.user)) {
        res.render("admin/regisColor");
    } else {
        res.redirect('/links/home');
    }
});
router.post("/registrar-color/add", async(req, res) => {
    if (evalAdmin(req.user)) {
        const { nombre } = req.body;
        try {
            const rep = await db.query(`insert into color (color) values ('${nombre}')`);
            req.flash("c", "Color anadido correctamente");
            req.session.save(function() {
                res.redirect("/colores");
            });
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect('/links/home');
    }
});
router.get("/editar-color/:id", async(req, res) => {
    if (evalAdmin(req.user)) {
        try {
            const id = req.params.id;
            console.log(id);
            const row = await db.query(`select * from color where id=${id};`);
            res.render("admin/editColor", { row });
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect('/links/home');
    }
});

router.post("/editar-color/add", async(req, res) => {
    if (evalAdmin(req.user)) {
        const { id, color } = req.body
        try {
            const sql = await db.query(`update color set color ='${color}' where id=${id};`)
            res.redirect('/colores')
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect('/links/home');
    }
});


router.post("/registrar-material/add", async(req, res) => {
    if (evalAdmin(req.user)) {
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
    } else {
        res.redirect('/links/home');
    }
});
router.get("/registrar-material", async(req, res) => {
    if (evalAdmin(req.user)) {
        res.render("admin/regisMaterial");
    } else {
        res.redirect('/links/home');
    }
});

router.get("/editar-material/:id", async(req, res) => {
    if (evalAdmin(req.user)) {
        try {
            const id = req.params.id;
            const row = await db.query(`select * from material where id=${id};`);
            res.render("admin/editMaterial", { row });
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect('/links/home');
    }
});

router.post("/editar-material/add", async(req, res) => {
    if (evalAdmin(req.user)) {
        const { id, material } = req.body
        try {
            const sql = await db.query(`update material set material ='${material}' where id=${id};`)
            res.redirect('/materiales')
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect('/links/home');
    }
});
//////////////////////////////////////////////////////////////////////////////

router.post("/registrar-tipo/add", async(req, res) => {
    if (evalAdmin(req.user)) {
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
    } else {
        res.redirect('/links/home');
    }
});

router.get("/registrar-tipo", async(req, res) => {
    if (evalAdmin(req.user)) {
        res.render("admin/regisTipo");
    } else {
        res.redirect('/links/home');
    }
});


router.get("/editar-tipo/:id", async(req, res) => {
    if (evalAdmin(req.user)) {
        try {
            const id = req.params.id;
            const row = await db.query(`select * from tipo_mueble where id=${id};`);
            res.render("admin/editTipo", { row });
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect('/links/home');
    }
});

router.post("/editar-tipo/add", async(req, res) => {
    if (evalAdmin(req.user)) {
        const { id, tipo } = req.body
        try {
            const sql = await db.query(`update tipo_mueble set tipo ='${tipo}' where id=${id};`)
            res.redirect('/tipos')
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect('/links/home');
    }
});
/////////////////////////////////////////////////////////////////////////////
router.get("/colores", async(req, res) => {
    if (evalAdmin(req.user)) {
        const colores = await db.query("select * from color;");
        res.render("admin/color", { colores });
    } else {
        res.redirect('/links/home');
    }
});

router.get("/materiales", async(req, res) => {
    if (evalAdmin(req.user)) {
        const materiales = await db.query("select * from material;");
        res.render("admin/material", { materiales });
    } else {
        res.redirect('/links/home');
    }
});

router.get("/tipos", async(req, res) => {
    if (evalAdmin(req.user)) {
        const tipos = await db.query("select * from tipo_mueble;");
        res.render("admin/tipos", { tipos });
    } else {
        res.redirect('/links/home');
    }
});
router.get("/Compras", async(req, res) => {
    if (evalAdmin(req.user)) {
        const compras = await db.query("select * from Compras;");
        res.render("admin/compras", { compras });
    } else {
        res.redirect('/links/home');
    }
});

router.get("/editar-proveedor/:id", async(req, res) => {
    const id = req.params.id;
    if (evalAdmin(req.user)) {
        const proveedor = await db.query(`select * from proveedor inner join tel_proveedor on proveedor.id = tel_proveedor.id_proveedor where proveedor.id =${id} ;`);
        res.render("admin/editProv", { proveedor });

    } else {
        res.redirect('/links/home');
    }
});
router.post("/editar-prov/add", async(req, res) => {
    if (evalAdmin(req.user)) {
        try {
            const { id, direccion, nombre, representante, contacto } = req.body;
            const id_p = await db.query(
                `update proveedor set direccion = '${direccion}', nombre = '${nombre}', persona_contacto= '${representante}' where id=${id}`
            );

            const resp1 = await db.query(
                `update tel_proveedor set  telefono= '${contacto}' where id_proveedor = ${id};`
            );
            req.flash("c", "Proveedor editado correctamente");
            res.redirect("/proveedores");
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect('/links/home');
    }
})


router.get("/proveedores", async(req, res) => {
    const id = req.params.id;
    if (evalAdmin(req.user)) {
        const proveedores = await db.query(`select * from proveedor ;`);
        res.render("admin/proveedores", { proveedores });

    } else {
        res.redirect('/links/home');
    }
});
router.get("/vendedores", async(req, res) => {
    const id = req.params.id;
    if (evalAdmin(req.user)) {
        const vendedores = await db.query(`select * from vendedor ;`);
        res.render("admin/vendedores", { vendedores });

    } else {
        res.redirect('/links/home');
    }
});

router.get("/editar-vendedor/:id", async(req, res) => {
    const id = req.params.id;
    if (evalAdmin(req.user)) {
        const vendedor = await db.query(`select * from vendedor where id =${id} ;`);
        res.render("admin/editVend", { vendedor });

    } else {
        res.redirect('/links/home');
    }
});
router.post("/editar-vend/add", async(req, res) => {
    if (evalAdmin(req.user)) {
        try {
            const { id, nombre } = req.body;
            const id_p = await db.query(
                `update vendedor set  nombre = '${nombre}' where id=${id}`
            );
            req.flash("c", "Vendedor editado correctamente");
            res.redirect("/vendedores");
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect('/links/home');
    }
})
module.exports = router;