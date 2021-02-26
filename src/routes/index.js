const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', async(req, res) => {
    req.flash('c', 'welcome admin');
    res.render('admin/homa');
});
module.exports = router;