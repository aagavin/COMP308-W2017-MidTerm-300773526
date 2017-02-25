/*
  Aaron Fernandes - 300773526 
  COMP 308 - Midterm exam 
	https://comp308-300773526.herokuapp.com/

  Model for the books collection
*/
let mongoose = require('mongoose');

// create a model class
let gamesSchema = mongoose.Schema({
    Title: String,
    Description: String,
    Price: Number,
    Author: String,
    Genre: String
},
{
  collection: "books"
});

module.exports = mongoose.model('books', gamesSchema);
