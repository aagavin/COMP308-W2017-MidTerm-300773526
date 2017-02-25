/*
  Aaron Fernandes - 300773526 
  COMP 308 - Midterm exam 
	https://comp308-300773526.herokuapp.com/

  This file handles the /books route
*/
// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let book = require('../models/books');

// require auth function
function requireAuth(req, res, next) {
  // check if the user is logged in
  if(!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
}

// returns the display
let getDisplayName = (req)=>{
  if (req.user){
    return req.user.displayName;
  }
  return '';
}

/* GET books List page. */
router.get('/',requireAuth, (req, res, next) => {

  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books,
        'displayName': getDisplayName(req)
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/add',requireAuth, (req, res, next) => {

    res.render('books/details', {title: 'Add a new book', books: new book(), 'displayName': getDisplayName(req)})

});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add',requireAuth, (req, res, next) => {

  let newBook = new book({"Title": req.body.title,"Description": '',"Price": req.body.price, "Author": req.body.author,"Genre": req.body.genre});

  book.create(newBook, (err, game)=>{
    if(err){
      console.log(err);
      res.send(err);
    }
    else{
      res.redirect('/books');
    }
  });
});

// GET the Book Details page in order to edit an existing Book
router.get('/:id',requireAuth, (req, res, next) => {
  try{
    let id = mongoose.Types.ObjectId.createFromHexString(req.params.id);

    book.findById(id, (err, book)=>{
      if(err){
        console.log(err);
        res.end(err);
      }
      else{
        res.render('books/details', {
          title: 'Book Details',
          books: book,
          'displayName': getDisplayName(req)
        });
      }
    });
  }
  catch(err){
    console.log(err);
    res.redirect('/errors/404');
  }

});

// POST - process the information passed from the details form and update the document
router.post('/:id', requireAuth,(req, res, next) => {

  try{
    let id = mongoose.Types.ObjectId.createFromHexString(req.params.id);

    let updateBook = book({
       "_id": id,
      "Title": req.body.title,
      "Description": '',
      "Price": req.body.price,
      "Author": req.body.author,
      "Genre": req.body.genre
    });

    book.update({_id: id}, updateBook, (err)=>{
      if(err){
        console.log(err);
        res.send(err);

      }
      else{
        res.redirect('/books');
      }
    });
  }
  catch(err){
    console.log(err);
    res.redirect('/errors/404');
  }

});

// GET - process the delete by user id
router.get('/delete/:id',requireAuth, (req, res, next) => {
 try{
    let id = mongoose.Types.ObjectId.createFromHexString(req.params.id);

    book.remove({_id: id}, (err)=>{
      if(err){
        console.log(err);
        res.end(err);
      }
      else{
         res.redirect('/books');
      }
    })
  }
  catch(err){
    console.log(err);
    res.redirect('/errors/404');
  }
    
});


module.exports = router;
