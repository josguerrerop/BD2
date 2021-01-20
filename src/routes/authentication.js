const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/signup', async (req,res) => {
res.render('auth/singup');
});

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));
  
router.get('/profile',(req,res)=>{
res.send('profile');
});

router.get('/signin', (req, res) => {
  res.render('auth/signin');
});

router.post('/signin', passport.authenticate('local.signin', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
}));

module.exports = router;