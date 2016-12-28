const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const CONTACTS_COLLECTION = 'contacts';

const app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

let db;

const MONGODB_URI = 'mongodb://localhost/contacts-dev';
if (process.env.NODE_ENV === 'production') {
  MONGODB_URI = process.env.MONGODB_URI;
}
// Database Connection
MongoClient.connect(MONGODB_URI, (err, database) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  // Save DB object for reuse
  db = database;
  console.log('Database connection ready');
  // Initialize the app
  const server = app.listen(process.env.PORT || 8080, () => {
    let port = server.address().port;
    console.log('App now running on port ', port);
  });

});


// API Routes
function handleError(res, reason, message, code) {
  console.log('ERROR: ' + reason);
  res.status(code || 500).json({'error': message});
}

app.get('/contacts', (req, res) => {

});

app.post('/contacts', (req, res) => {
  let newContact = req.body;
  newContact.createDate = new Date();

  if (!(req.body.firstName || req.body.lastName)) {
    handleError(res, "Invalid user input", "Must provide a first or last name.", 400);
  }

  db.collection(CONTACTS_COLLECTION).insertOne(newContact, (err, doc) => {
    if (err) {
      handleError(res, err.message, 'Failed to create new contact.');
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

app.get('/contacts/:id', (req, res) => {

});

app.put('/contacts/:id', (req, res) => {

});

app.delete('/contacts/:id', (req, res) => {

});
