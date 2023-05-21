const express = require('express'); // server shit
const bodyParser = require("body-parser");
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const db = require('./db.js') // connectie met db

const app = express();

app.use(bodyParser.json()); // parse json
app.use(bodyParser.urlencoded({ extended: false })); // kijkt naar content-type en of t matcht
app.use(helmet()); // html headers
app.use(cors()); // dit doet iets
app.use(compression()); 

app.get("/", function(req, res){
  res.send('nothing to see here');
});

app.get("/jsontest", function(req, res){
  res.type('json');
  res.json('aaaaaaaa');
});

app.get("/test", function(req, res){
  //res.send('test'); < dit zorgde er voor dat het de hele tijd borkte. je kan maar 1x een send of json dingetje hebben.
  res.type('json');
  db.all('SELECT name FROM sqlite_schema', (err, row) => {
    if (err){
      console.log(err.message);
    }
    console.log(row);
    res.send(JSON.stringify(row));
  });
});

app.get("/test_birb", function(req, res){
  res.type('json');
  db.all('SELECT * FROM vogels', (err, row) => {
    if (err){
      throw new Error(err.message);
    }
    console.log(row);
    res.json(row);
  });
});

app.get("/test_games", function(req, res){
  res.type('json');
  db.all('SELECT * FROM games', (err, row) => {
    if (err){
      throw new Error(err.message);
    }
    res.json(row);
    console.log(row);
  });
});

app.get("/test_random", function(req, res){
  res.type('json');
  db.all('SELECT * FROM random', (err, row) => {
    if (err){
      throw new Error(err.message);
    }
    res.json(row);
    console.log(row);
  });
});

app.listen(81); // start server