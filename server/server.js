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

app.post('/api/saveNewSurvey', bodyParser.json(), async function (req, res) {
  try {
    // starting a SQL transaction
    await runQuery('BEGIN')
    // inserting a survey and getting the inserted id back
    const surveyId = await insertAndGetLastId("INSERT INTO survey (title, description, open_date, close_date, can_be_anonymous) VALUES (?, ?, ?, ?, ?)",
      [req.body.title, req.body.description, req.body.openDate, req.body.closeDate, req.body.anonymity])
    // commit the started SQL transaction
    await runQuery('COMMIT');
    try {
      // starting a loop to insert every question in the database
      for (const [index, question] of req.body.questions.entries()) {

        //check in the question is an open or a multiple choice question
        if (question.type === 'Open') {
          // starting a SQL transaction for every loop cycle
          await runQuery('BEGIN')
          // inserting an open question and getting the inserted id back, so you can use it in the question query
          const openQuestionId = await insertAndGetLastId("INSERT INTO open_question (question) VALUES (?)",
            [question.question])

          // inserting the question with the open question id and getting the question id back
          const questionId = await insertAndGetLastId("INSERT INTO questions (Open_Question_ID, is_deleted) VALUES (?, ?)",
            [openQuestionId, false])

          // insert everything in the filled_in table to combine everything
          await runQuery("INSERT INTO filled_in (Survey_ID, Question_ID, question_order) VALUES (?, ?, ?)",
            [surveyId, questionId, index])
          // commit the started SQL transaction for every loop cycle
          await runQuery('COMMIT');
        } else if (question.type === 'MultipleChoice') {

        } else {
          console.log('wrong type of question')
        }
      }
    } catch (error) {
      // in case of an error rollback the SQL transaction
      await runQuery('ROLLBACK');
      console.log(error)
    }
  } catch (error) {
    await runQuery('ROLLBACK');
  }
  // Helper function to put a insert and a last id together
  async function insertAndGetLastId(query, param) {
    await runQuery(query, param)
    return await getLastInsertedId()
  }
  // Helper function to get the ID of the last inserted row
  function getLastInsertedId() {
    return new Promise((resolve, reject) => {
      db.get('SELECT last_insert_rowid() as id', (error, row) => {
        if (error) {
          reject(error);
        } else {
          resolve(row.id);
        }
      });
    });
  }
  // Helper function to run a query with parameters
  function runQuery(sql, params) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (error) {
        if (error) {
          reject(error);
        } else {
          resolve(this);
        }
      });
    });
  }
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
  const { type, question, questionId, options } = req.body;
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
  else if (type === 'MultipleChoice') {
    db.run('UPDATE multiple_choice SET question = ? WHERE multiple_choice_id = ?', [question, questionId],
      function (err) {
        console.log(err.message);
      },
      console.log('question_id:', questionId),
      console.log('question', question)
    )
    db.run('UPDATE option SET option = ? WHERE option_id = ?', [options, questionId],
      function (err) {
        console.log(err.message);
      },
      console.log('')
    )
  }
});

/* GET function for fetching all questions. */
app.get("/api/questions", function (req, res) {

  const isOpen = req.query.open === 'notdeleted';
  const isDeleted = req.query.open === 'isdeleted';
  const showOpenQuestions = req.query.open === 'OpenQuestions';
  const showMultipleChoice = req.query.open === 'MultipleChoiceQuestions';
  res.type('json');
  sql = `SELECT questions.Question_ID, open_question.question, questions.is_deleted, questions.Open_Question_ID, questions.Multiple_Choice_ID
  from questions
  LEFT JOIN open_question on questions.Open_Question_ID = open_question.Open_Question_ID
  LEFT JOIN multiple_choice ON questions.Multiple_Choice_ID = multiple_choice.Multiple_Choice_ID`;

  if (isOpen) {
    sql += ` WHERE questions.is_deleted = 0`
  } else if (showOpenQuestions)
    sql += ' WHERE open_question.Open_Question_ID is NOT NULL AND multiple_choice.multiple_Choice_ID IS NULL AND questions.is_deleted = 0'
  else if (showMultipleChoice)
    sql += ` WHERE multiple_choice.Multiple_Choice_ID IS NOT NULL AND open_question.Open_Question_ID IS NULL AND questions.is_deleted = 0`
  else if (isDeleted)
    sql += ` WHERE (open_question.Open_Question_ID IS NOT NULL Or Multiple_choice.Multiple_Choice_ID IS NULL) AND
   questions.is_deleted = 1`
  console.log(sql)
  db.all(sql, (err, row) => {
    if (err) {
      console.log(err.message);
    }
    console.log(row);
    res.send(JSON.stringify(row));
  });
});


/* Actually we might not need to delete route.. we have this we can use to switch to is_deleted to 1 */
app.put('/api/questions', bodyParser.json(), (req, res) => {
  res.type('json');

  /* questionId we sent through a const array to body (see questionlist.jsx DeleteQuestion function)*/
  const { is_deleted, questionId } = req.body;
  console.log('question ID is ' + questionId);
  console.log('req.body question id ' + req.body.questionId);
  console.log('is_deleted ' + is_deleted)

  /* We run a db.run query that deletes the question based on the question Id */
  db.run('UPDATE questions SET is_deleted = ? WHERE Question_ID = ?', [is_deleted, questionId]),
    function (err) {
      console.log(err.message);
    },
    console.log("DELETE Request Called for " + questionId)
  res.send("DELETE Request Called")
});


/* GET endpoint for questions with question id parameters 
the req.params.id gets the id from the URL and we pass this ID to the sql query. */
app.get("/api/questions:id", function (req, res) {
  res.type('json');

  const questionId = req.params.id

  const sql = 'SELECT * FROM questions WHERE Question_ID = ?';
  console.log('dit is ' + req.params.id)
  console.log(questionId)
  console.log(req.params['id'])

  /* Calls the database with the sql query variable and the questionId as argument. */
  db.all(sql, [questionId], (err, row) => {
    if (err) {
      console.log(err.message);
    }
    console.log(row);
    res.send(JSON.stringify(row));
  });
});


/* GET function for fetching all surveys.
 We give the API endpoint a query parameter with req.query.open which allows us to
 fetch it in surveylist.jsx and depending on the query parameter it will show 
 the open or closed surveys  */
app.get("/api/surveys", function (req, res) {
  res.type('json');

  /* sets the query parameters in the url */
  const isOpen = req.query.open === 'true';
  const isClosed = req.query.open === 'false';
  const beingReviewed = req.query.open === 'reviewed';

  /* formats the time to DD-MM-YY so it works with database times*/
  let currentDate = new Date();
  let formattedDate = currentDate.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  }).split('/').join('-'); // Convert slashes to dashes


  console.log(isOpen)
  console.log(isClosed)
  console.log('req query ' + req.query.close_date)
  console.log('req.query open ' + req.query.open_date)
  console.log(req.query.open)
  let sql = `select survey.*, IFNULL(LENGTH(filled_in.User_ID), 0) AS participants
  from survey
  LEFT JOIN filled_in ON survey.Survey_ID = filled_in.Survey_ID `;
  if (isOpen) {
    sql += ` WHERE close_date > '${formattedDate}' AND is_reviewed = 1`;
  } else if (isClosed) {
    sql += ` WHERE close_date < '${formattedDate}' AND is_reviewed = 1`;
  } else if (beingReviewed) {
    sql += ` WHERE is_reviewed = 0`;
  }
  console.log(sql)
  console.log('this is sql ' + sql)
  db.all(sql, (err, rows) => {
    if (err) {
      console.log(err.message);
      res.status(500).send('Internal Server Error');
      return;
    }
    console.log(rows);
    res.send(JSON.stringify(rows));
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
  const id = req.query.Question_ID;
  // let sql = `SELECT questions.Question_ID, open_question.Open_Question_ID, open_question.question, multiple_choice.Multiple_Choice_ID, multiple_choice.question
  // FROM questions 
  // INNER JOIN open_question ON questions.Question_ID = open_question.open_Question_ID
  // INNER JOIN multiple_choice ON questions.Question_ID = multiple_choice.multiple_Choice_ID`;

  query = `SELECT * FROM filled_in`
  console.log('req query ' + req.query);
  console.log('req body' + req.body);
  console.log('question_ID' + id);
  console.log
  db.all(query, (err, row) => {
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
