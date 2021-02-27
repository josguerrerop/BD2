const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', async(req, res) => {
    res.redirect('links/home');

});
module.exports = router;