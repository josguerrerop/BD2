const express = require('express');
const { as } = require('pg-promise');
const { func } = require('../database');
const router = express.Router();
const db = require('../database');
//const pg = db.connect();



 router.get('/take', async (req,res) => {
  try{  
  var x = await db.query('select * from material');
  var proveedores = await db.query('select id from color');
  res.render('links/take',{x,proveedores});
   }catch(error){
     console.log(error);
  }
});

router.get('/add',(req,res)=>{
res.render('links/add');
});

router.get('/xd',async (req,res)=>{
  req.flash('c','xddd');
  req.session.save(function() {
    res.redirect('/links/take');
});

});


router.post('/add', async (req,res)=>{
const {id,name} =req.body;
const link = {id,name};
try{  
    await db.query('INSERT INTO material (id,material) values (${id},${name})',link); 
      req.flash('c','xddd');
      req.session.save(function() {
      res.redirect('/links/take');
    });
   }catch(error){
    console.log(error);
  }
});

module.exports = router;