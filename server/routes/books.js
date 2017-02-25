// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {

    res.render('books/details', {title: 'Add a new book', books: new book()})

});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (req, res, next) => {

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
router.get('/:id', (req, res, next) => {
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
          books: book
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
router.post('/:id', (req, res, next) => {

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
router.get('/delete/:id', (req, res, next) => {
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
