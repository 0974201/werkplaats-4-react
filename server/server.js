const express = require('express'); // server shit
const cors = require('cors');
const bodyParser = require('body-parser')
const db = require('./db.js') // connectie met db

const app = express();

app.use(cors()); // allow cross orgin req
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get("/", function(req, res){
  res.send('nothing to see here');
});

app.post('/api/saveNewSurvey', bodyParser.json(), function (req, res) {
  console.log(req.body)

  db.run(
      "INSERT INTO survey (description, open_date, close_date) VALUES (?, ?, ?)",
      [req.body.description, req.body.openDate, req.body.closeDate],
      function(err){
        if (err) {
          console.log(err.message)
        } else {
          console.log(this)
        }

      })
  db.close()
  // req.body.questions.forEach(function(question){
  //   if (question.type === 'Open'){
  //
  //   }else if (question.type === 'MultipleChoice') {
  //
  //   }else{
  //     console.log('wrong type of question')
  //   }
  // })
  res.send('saved')
})

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