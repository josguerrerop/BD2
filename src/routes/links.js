const express = require('express');
const router = express.Router();
const db = require('../database');

 router.get('/take', async (req,res) => {
  try{  
  db.connect();
  var x = await db.query('select * from take');
  res.render('links/take',{x});
   }catch(error){
     console.log(error);
  }
});
module.exports = router;