const express = require('express'); // server shit
const cors = require('cors');
const bodyParser = require('body-parser')
const db = require('./db.js') // connectie met db

const app = express();

app.use(cors()); // allow cross orgin req
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get("/", function (req, res) {
  res.send('nothing to see here');
});

app.post('/api/saveNewSurvey', bodyParser.json(), function (req, res) {
  console.log(req.body)

  let surveyId = ''
  let questionOrder = 0

  db.run(
    "INSERT INTO survey (description, open_date, close_date) VALUES (?, ?, ?)",
    [req.body.description, req.body.openDate, req.body.closeDate],
    function (err) {
      if (err) {
        console.log(err.message)
      } else {
        console.log('survey id:' + this.lastID)
        surveyId = this.lastID
      }
    }
  )
  req.body.questions.forEach(function (question) {
    if (question.type === 'Open') {
      let openQuestionId = ''
      let questionId = ''
      db.run(
        "INSERT INTO open_question (question) VALUES (?)",
        [req.body.question],
        function (err) {
          if (err) {
            console.log(err.message)
          } else {
            console.log('open question id:' + this.lastID)
            openQuestionId = this.lastID
          }
        }
      )
      db.run(
        "INSERT INTO questions (Open_Question_ID, is_deleted) VALUES (?, ?)",
        [openQuestionId, false],
        function (err) {
          if (err) {
            console.log(err.message)
          } else {
            console.log('question id:' + this.lastID)
            questionId = this.lastID
          }
        }
      )
      db.run(
        "INSERT INTO filled_in (Survey_ID, Question_ID, question_order, is_reviewed) VALUES (?, ?, ?, ?)",
        [surveyId, questionId, questionOrder, false],
        function (err) {
          if (err) {
            console.log(err.message)
          } else {
            console.log('filled_in id:' + this.lastID)
            questionOrder++
          }
        }
      )
    } else if (question.type === 'MultipleChoice') {

    } else {
      console.log('wrong type of question')
    }
  })
  res.send('saved')
})

app.get("/test", function (req, res) {
  //res.send('test'); < dit zorgde er voor dat het de hele tijd borkte. je kan maar 1x een send of json dingetje hebben.
  res.type('json');
  db.all('SELECT name FROM sqlite_schema', (err, row) => {
    if (err) {
      console.log(err.message);
    }
    console.log(row);
    res.send(JSON.stringify(row));
  });
});

/* dummy test api endpoint */
app.get("/api/test_question", function (req, res) {
  res.type('json');
  db.all('Select * FROM questions', (err, row) => {
    if (err) {
      console.log(err.message);
    }
    console.log(row);
    res.send(JSON.stringify(row));
  });
});

/* this endpoint is for changing questions.
We first check if it's an open or multiple choice and then update the columns around it.
for multiple choice we will also have to update the options. */
app.post('/api/questions', bodyParser.json(), function (req, res) {
  const { type, question, questionId } = req.body;
  console.log('Question type is ' + type)
  console.log('Question is ' + question)
  console.log('Question Id is ' + questionId)
  console.log('Req.body is ' + req.body)
  res.type('json');
  if (type === 'Open') {
    db.run('UPDATE open_question SET question = ? WHERE open_question_id = ?', [question, questionId],
      function (err) {
        console.log(err.message);
      },
      console.log('question_id:', questionId),
      console.log('question', question)
    )
  }
  else if (req.body.type === 'MultipleChoice') {
    db.run('UPDATE multiple_choice SET question = ? WHERE multiple_choice_id = ?', [req.body.question, req.body.questionId],
      function (err) {
        console.log(err.message);
      },
      console.log('question_id:', questionId),
      console.log('question', question)
    )
    db.run('UPDATE option SET option = ? WHERE option_id = ?', [req.body.options, req.body.questionId],
      function (err) {
        console.log(err.message);
      },
      console.log('')
    )
  }
});

/* GET function for fetching all questions. */
app.get("/api/questions", function (req, res) {
  res.type('json');
  db.all('Select * FROM questions', (err, row) => {
    if (err) {
      console.log(err.message);
    }
    console.log(row);
    res.send(JSON.stringify(row));
  });
});

/* GET function for fetching all surveys. */
app.get("/api/surveys", function (req, res) {
  res.type('json');
  db.all('Select * FROM survey', (err, row) => {
    if (err) {
      console.log(err.message);
    }
    console.log(row);
    res.send(JSON.stringify(row));
  });
});

/* GET endpoint for the user table. */
app.get('/api/users', function (req, res) {
  res.type('json');
  db.all('Select * from user', (err, row) => {
    if (err) {
      console.log(err.message);
    }
    console.log(row)
    res.send(JSON.stringify(row));
  });
});

/* GET endpoint for filled_in surveys */
app.get('/api/filled_surveys', function (req, res) {
  res.type('json');
  db.all('Select * from filled_in', (err, row) => {
    if (err) {
      console.log(err.message);
    }
    console.log(row)
    res.send(JSON.stringify(row));
  });
});



/*app.get("/test_birb", function(req, res){
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
});*/


app.listen(81); // start server
