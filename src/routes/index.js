const express = require('express');
const router = express.Router();
const db = require('../database');

 router.get('/', async (req,res) => {
  try{  
  db.connect();
  const x = await db.query('select * from take');
res.send(x);
   }catch(error){
     console.log(error);
  }
});
module.exports = router;