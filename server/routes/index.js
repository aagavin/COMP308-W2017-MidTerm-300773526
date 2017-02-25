/*
  Aaron Fernandes - 300773526 
  COMP 308 - Midterm exam 
	https://comp308-300773526.herokuapp.com/

  This file handles the root route
*/
// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
// import password
let passport = require('passport');

// define the game model
let book = require('../models/books');
let user = require('../models/users').User;

// gets the users displayName
let getDisplayName = (req)=>{
  if (req.user){
    return req.user.displayName;
  }
  return '';
}
/* GET home page. wildcard */
router.get('/', (req, res, next) => {
  var jokesJson = require('../jokes');
  // for(let i =0; i<jokesJson['data']['children'].length);
  
  res.render('content/index', {
    title: 'Home',
    books: '',
    'displayName': getDisplayName(req),
    jokes: jokesJson['data']['children']
   });
});

// login route
router.get('/login', (req, res, next)=>{

  res.render('auth/login', {
    'title': 'Login',
    'displayName': getDisplayName(req)
  });
});

// authenticate the user 
router.post('/login', passport.authenticate('local', {
  successRedirect: '/books',
  failureRedirect: '/login',
  failureFlash: 'bad login'
}));

// register get route
router.get('/register', (req, res, next)=>{

  if(getDisplayName(req)==''){
    res.render('auth/register', {'title': 'Register a new account', 'displayName': getDisplayName(req)});
  }
  else{
    res.redirect('/');
  }
});

// add a new user to the database 
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
