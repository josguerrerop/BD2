const express = require('express');
const router = express.Router();
const db = require('../database');

 router.get('/', async (req,res) => {
   res.send('hello world');
   /*
  try{  
  db.connect();
  const x = await db.query('select * from take');
  res.send(x);
  res.render('links/take',{x});
   }catch(error){
     console.log(error);
  }
  */
});
module.exports = router;