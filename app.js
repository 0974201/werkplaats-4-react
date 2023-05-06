const express = require('express'); // server shit
const db = require('./database/db.js') // connectie met db
//const getBirb = require('./database/models/taebl.js');
//const getGaem = require('./database/models/taebl.js');

const app = express();

app.get("/", function(req, res){
  res.send('hœm');
});

app.get("/aaaa", function(req, res){
  res.json('aaaaaaaa');
});

app.get("/test", function(req, res){
  //res.send('test'); < dit zorgde er voor dat het de hele tijd borkte. je kan maar 1x een send of json dingetje hebben.
  db.all('SELECT name FROM sqlite_schema', (err, row) => {
    if (err){
      console.log(err.message);
    }
    console.log(row);
    res.json(row);
  });
});

app.get("/test_birb", function(req, res){
  db.all('SELECT * FROM vogels', (err, row) => {
    if (err){
      throw new Error(err.message);
    }
    console.log(row);
    res.json(row);
  });
});

app.get("/test_gaem", function(req, res){
  db.all('SELECT * FROM games', (err, row) => {
    if (err){
      throw new Error(err.message);
    }
    res.json(row);
    console.log(row);
  });
});


app.get("/test_map", function(req, res){ //hmmm
  db.map('SELECT * FROM games', (err, row) => {
    if (err){
      throw new Error(err.message);
    }
    res.json(row);
    console.log(row);
  });
});

app.listen(81); // start server