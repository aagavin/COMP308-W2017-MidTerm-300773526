// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
// import password
let passport = require('passport');

// define the game model
let book = require('../models/books');
let user = require('../models/users').User;


let getDisplayName = (req)=>{
  if (req.user){
    return req.user.displayName;
  }
  return '';
}
/* GET home page. wildcard */
router.get('/', (req, res, next) => {
  let displayName = '';
  if (req.user){
    displayName=req.user.displayName;
  }

  res.render('content/index', {
    title: 'Home',
    books: '',
    'displayName': getDisplayName(req)
   });
});

router.get('/login', (req, res, next)=>{
  let displayName = '';
  if (req.user){
    displayName=req.user.displayName;
  }
  res.render('auth/login', {
    'title': 'Login',
    'displayName': displayName
  });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/books',
  failureRedirect: '/login',
  failureFlash: 'bad login'
}));

router.get('/register', (req, res, next)=>{
  res.render('auth/register', {'title': 'Register a new account'});
});

router.post('/register', (req, res, next)=>{
  let newUser = new user({
    username: req.body.username,
    email: req.body.email,
    displayName: req.body.displayName
  });

  user.register(newUser, req.body.password, (err)=>{
    if(err){ console.log('error adding new user'); }

    return passport.authenticate('local')(req, res, ()=>{
      res.redirect('/');
    });
  })
});

router.get('/logout', (req, res, next)=>{
  req.logout();
  res.redirect('/'); // redirect to the home page
});

module.exports = router;
