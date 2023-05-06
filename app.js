const express = require('express'); // server shit
const db = require('./database/db.js') // connectie met db

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

app.listen(81); // start server