const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/signup', async (req,res) => {
res.render('auth/singup');
});

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/links/home',
    failureRedirect: '/signup',
    failureFlash: true
  }));
  


router.get('/signin', (req, res) => {
  res.render('auth/signin');
});

router.post('/signin', passport.authenticate('local.signin', {
  successRedirect: '/links/home',
  failureRedirect: '/signup',
  failureFlash: true
}));

module.exports = router;