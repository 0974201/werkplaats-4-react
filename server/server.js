const express = require('express'); // server shit
const cors = require('cors');
const bodyParser = require('body-parser')
const db = require('./db.js'); // connectie met db
const { redirect } = require('react-router-dom');

const app = express();
let returned_user;

app.use(cors()); // allow cross orgin req
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

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

app.get("/", function (req, res) {
  res.send('nothing to see here - connected with database');
});

app.post('/api/saveNewSurvey', bodyParser.json(), async function (req, res) {
  try {
    // starting a SQL transaction
    await runQuery('BEGIN')
    // inserting a survey and getting the inserted id back
    const surveyId = await insertAndGetLastId("INSERT INTO survey (title, description, open_date, close_date, can_be_anonymous) VALUES (?, ?, ?, ?, ?)",
      [req.body.title, req.body.description, req.body.open_date, req.body.close_date, req.body.anonymity])
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
          const openQuestionId = await insertAndGetLastId("INSERT INTO open_question (open_question) VALUES (?)",
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
          // starting a SQL transaction for every loop cycle
          await runQuery('BEGIN')

          // inserting a multiple choice question and getting the inserted id back, so you can use it in the question query and the option_row query
          const multiQuestionId = await insertAndGetLastId("INSERT INTO multiple_choice (multi_question) VALUES (?)",
            [question.question])

          // starting a loop to insert every option in the database
          for (const [index, option] of question.options.entries()) {

            // inserting an option and getting the id back for use in the option_row query
            const optionId = await insertAndGetLastId("INSERT INTO option (option) VALUES (?)",
              [option])

            // inserting multiQuestionId and optionId into a table to have a connection between tje two
            await runQuery("INSERT INTO option_row (Multiple_Choice_ID, Option_ID, option_order) VALUES (?, ?, ?)",
              [multiQuestionId, optionId, index])
          }

          // inserting the question with the open question id and getting the question id back
          const questionId = await insertAndGetLastId("INSERT INTO questions (Multiple_Choice_ID, is_deleted) VALUES (?, ?)",
            [multiQuestionId, false])

          // insert everything in the filled_in table to combine everything
          await runQuery("INSERT INTO filled_in (Survey_ID, Question_ID, question_order) VALUES (?, ?, ?)",
            [surveyId, questionId, index])

          // commit the started SQL transaction for every loop cycle
          await runQuery('COMMIT')
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

  res.send('saved')
})

app.get('/api/getSurvey/:surveyId', function (req, res) {
  const surveyId = parseInt(req.params['surveyId'])

  db.get("SELECT Survey_ID, title, description, open_date, close_date, can_be_anonymous FROM survey WHERE Survey_ID = ?",
    [surveyId], function (error, rows) {
      if (error) {
        console.log(error)
      } else {
        console.log(rows)
        res.send(JSON.stringify(rows))
      }
    })
})

app.get('/api/getSurveyQuestions/:surveyId', function (req, res) {
  const surveyId = parseInt(req.params['surveyId'])

  db.all(
    "SELECT filled_in.Question_ID, filled_in.question_order, multiple_choice.multi_question, multiple_choice.Multiple_Choice_ID, open_question.open_question FROM filled_in " +
    "LEFT JOIN questions ON filled_in.Question_ID = questions.Question_ID " +
    "LEFT JOIN multiple_choice ON questions.Multiple_Choice_ID = multiple_choice.Multiple_Choice_ID " +
    "LEFT JOIN open_question ON questions.Open_Question_ID = open_question.Open_Question_ID " +
    "WHERE filled_in.Survey_ID = ? AND filled_in.answer is null",
    [surveyId], function (error, rows) {
      if (error) {
        console.log(error)
      } else {
        console.log(rows)
        res.send(JSON.stringify(rows))
      }
    })
})

app.get('/api/getSurveyOptions/:surveyId', function (req, res) {
  const surveyId = parseInt(req.params['surveyId'])

  db.all("SELECT multiple_choice.Multiple_Choice_ID, option.option FROM option_row " +
    "LEFT JOIN multiple_choice ON option_row.Multiple_Choice_ID = multiple_choice.Multiple_Choice_ID " +
    "LEFT JOIN option ON option_row.Option_ID = option.Option_ID " +
    "WHERE multiple_choice.Multiple_Choice_ID IN (" +
    "SELECT Multiple_Choice_ID FROM questions WHERE Question_ID IN (" +
    "SELECT Question_ID FROM filled_in WHERE Survey_ID = ?) AND Multiple_Choice_ID IS NOT NULL)",
    [surveyId], function (error, rows) {
      if (error) {
        console.log(error)
      } else {
        console.log(rows)
        res.send(JSON.stringify(rows))
      }
    })
})

app.post('/api/saveAnswers', bodyParser.json(), function (req, res) {
  console.log(req.body)
  try {

    for (const [index, question] of req.body.questions.entries()) {
      runQuery("INSERT INTO filled_in (Question_ID, Survey_ID, date_answered, answer, User_ID, question_order) VALUES (?, ?, datetime('now', 'localtime'), ?, ?, ?)",
        [question.Question_ID, req.body.Survey_ID, question.answer, "", question.question_order]
      )
    }

  } catch (error) {
    console.log(error)
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
  const { type, question, questionId, option1, option2, option3, option4, optionid1, optionid2, optionid3, optionid4 } = req.body;
  res.type('json');
  console.log(type)
  console.log(question)
  console.log('dit is ' + questionId)
  console.log(option1)



  /* Checks if the type is open and if so updates open_question. */
  if (type === 'Open') {
    db.run('UPDATE open_question SET open_question = ? WHERE Open_Question_ID = ?', [question, questionId],
      function (err) {
        console.log(err.message);
      },
      console.log('Open Question ' + questionId + ' has successfully updated to ' + question),

    )
  } /* If not open then it updates multiple choice */
  else if (type === 'MultipleChoice') {
    db.run('UPDATE multiple_choice SET multi_question = ? WHERE Multiple_Choice_ID = ?', [question, questionId],
      function (err) {
        console.log(err.message);
      },
      console.log('Multiple Choice Question ' + questionId + ' has successfully updated to ' + question),
    ) /* Multiple choice also has to update options so we put that after it has ran the first query. */
    db.run('UPDATE option SET option = ? WHERE Option_ID = ? ', [option1, optionid1],
      function (err) {
        console.log(err.message);
      },
      console.log('Option have been changed to ' + option1 + ' at Option_ID ' + optionid1)
    ),
      db.run('UPDATE option SET option = ? WHERE Option_ID = ? ', [option2, optionid2],
        function (err) {
          console.log(err.message);
        },
        console.log('Options have been changed to ' + option2 + ' at Option_ID ' + optionid2)
      )
    if (option3)
      db.run('UPDATE option SET option = ? WHERE Option_ID = ?', [option3, optionid3],
        function (err) {
          console.log(err.message);
        },
        console.log('Options have been changed to ' + option3 + ' at Option_ID ' + optionid3)
      )
  } if (option4)
    db.run('UPDATE option SET option = ? WHERE Option_ID = ?', [option4, optionid4],
      function (err) {
        console.log(err.message);
      },
      console.log('Options have been changed to ' + option4 + ' at Option_ID ' + optionid4)
    )
},
);

/* GET function for fetching all questions. */
app.get("/api/questions", function (req, res) {

  /* query parameters so we can fetch them */
  const isOpen = req.query.open === 'notdeleted'; /* For all questions that are not deleted */
  const isDeleted = req.query.open === 'isdeleted'; /* For all questions that are deleted */
  const showOpenQuestions = req.query.open === 'OpenQuestions'; /* Shows all Open Questions that are not deleted*/
  const showMultipleChoice = req.query.open === 'MultipleChoiceQuestions'; /* Shows all Multi Choice questions that are not deleted*/

  /* Base SQL query that joins the questions table question ID with open question and multi question */
  res.type('json');
  let sql = `SELECT questions.Question_ID, open_question.open_question, multiple_choice.multi_question, questions.is_deleted, questions.Open_Question_ID, questions.Multiple_Choice_ID
  from questions
  LEFT JOIN open_question on questions.Open_Question_ID = open_question.Open_Question_ID
  LEFT JOIN multiple_choice ON questions.Multiple_Choice_ID = multiple_choice.Multiple_Choice_ID`;

  /* Specifies the condition. if the query parameter is same as above query parameter then it will add
  this additional piece of query condition.*/
  if (isOpen) {
    sql += ` WHERE questions.is_deleted = 0`
  } else if (showOpenQuestions)
    sql += ' WHERE multiple_choice.multiple_Choice_ID IS NULL AND questions.is_deleted = 0'
  else if (showMultipleChoice)
    sql += ` WHERE open_question.Open_question_ID IS NULL AND questions.is_deleted = 0`
  else if (isDeleted)
    sql += ` WHERE questions.is_deleted = 1`

  /* Executes the database query and it takes one argument.
  sql is the base SQL query we have up there. */
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
app.get("/api/questions/:id", function (req, res) {
  res.type('json');

  /* Gives a variable to the req.params. req.params gets the id from the JSON url*/
  const questionId = req.params.id;

  /* The Base Query that execute.
  We select questions question_ID and have it joined by the open and multi choice questions and their id,
  and as last we have the Question_ID which we will get from the second argument[questionId]
  This allows us to fetch the questions per ID .*/
  const sql = `SELECT questions.Question_ID, open_question.open_question, open_question.open_question_ID, multiple_choice.multi_question, multiple_Choice.Multiple_choice_ID, option_row.Option_order, option_row.Option_ID, option.option
  FROM questions
  LEFT JOIN open_question ON questions.Open_Question_ID = open_question.open_question_ID
  LEFT JOIN multiple_choice ON questions.Multiple_Choice_ID = multiple_choice.Multiple_Choice_ID
  LEFT JOIN option_row ON multiple_choice.Multiple_Choice_ID = option_row.Multiple_Choice_ID
  LEFT JOIN option ON option_row.Option_ID = option.Option_ID
  WHERE Question_ID = ?`



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

  /* formats the time to YYYY-MM-DD so it works with database times. */
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-based
  const day = String(currentDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  console.log(formattedDate)



  /* The base query that executes.
  select survey.* gets us everything from survey. Distinct makes it so every row is unique and thus no duplicates.
  We get the Length from table filled_in (User_ID) and give it an alias participants so we can use it for mapping {item.participants}.
  The IFNULL checks if it's a NULL Value(default value we will get from the length of the survey)
  and replaces it with a 0. */
  let sql = `select DISTINCT survey.* , IFNULL(LENGTH(filled_in.User_ID), 0) AS participants
  FROM survey
  LEFT JOIN filled_in on survey.Survey_ID = filled_in.Survey_ID`;

  /* Checks for the parameters and executes additional sql query if condition is met.*/
  if (isOpen) {
    sql += ` WHERE close_date > '${formattedDate}' AND is_reviewed = 1`;
  } else if (isClosed) {
    sql += ` WHERE close_date < '${formattedDate}' AND is_reviewed = 1`;
  } else if (beingReviewed) {
    sql += ` WHERE is_reviewed = 0`;
  }

  /* Executes the query with the sql query as an argument. */
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

app.get("/api/surveys/:id", function (req, res) {
  res.type('json');

  const SurveyId = parseInt(req.params.id);
  console.log('dit is survey id ' + SurveyId)
  let sql = `SELECT filled_in.* , multiple_choice.multi_question, multiple_choice.Multiple_Choice_ID, open_question.open_question
  FROM filled_in
  LEFT JOIN questions ON filled_in.Question_ID = questions.Question_ID 
  LEFT JOIN multiple_choice ON questions.Multiple_Choice_ID = multiple_choice.Multiple_Choice_ID 
  LEFT JOIN open_question ON questions.Open_Question_ID = open_question.Open_Question_ID 
  WHERE filled_in.Survey_ID = ? AND filled_in.answer is null`;

  console.log(sql)
  console.log('this is sql ' + sql)
  db.all(sql, [SurveyId], (err, rows) => {
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
app.get('/api/filled_surveys/:questionId', function (req, res) {
  res.type('json');
  const questionId = parseInt(req.params['questionId']);

  console.log('dit is ' + questionId)

  let sql = `SELECT * from filled_in
  WHERE answer is not null AND Question_ID = ?`;

  db.all(sql, [questionId], (err, row) => {
    if (err) {
      console.log(err.message);
    }
    console.log(row)
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

app.get("/handle_login", function(req, res){
  res.send('post');
});

/*user = [{// temp user, moet nog users aanmaken kek
  email:"eeee@gmail.com",
  password:"eeeeeee"
}];

app.post("/handlelogin", bodyParser.json(), function(req, res, next){
  console.log(req.body.email, req.body.password); // kijken of hij login gegevens door stuurt
  const { email, password } = req.body;

  const login = (email, password) => user.some(user => user.email === email && user.password === password);
  // whack manier om te checken of doorgestuurde inlog klopt met array

  login(email, password) ?
  res.redirect('/post_login') : res.sendStatus(451); // check of inlog overeenkomt anders gooit ie status error

  //res.send('post');
});*/

app.post("/handle_login", bodyParser.json(), function(req, res, next){
  console.log(req.body.email, req.body.password); // kijken of hij login gegevens door stuurt
  const { email, password } = req.body;

  db.get('SELECT * FROM login WHERE email = ? AND password = ?', [email, password], (err, row) => {
    if (err){
       console.log(err.message);
    } else if(row === undefined) {//als combi niet klopt geeft hij undefined terug
      res.status(451).json({
        message: "451 Unavailable For Legal Reasons"
      }); 
      console.log(row); //kijken of ie ook undefined teruggeeft
    } else {
      console.log(row); //geeft hij een row terug?
      console.log(typeof row); //object
      console.log(Object.entries(row)[1]); //k:v van obj
      returned_user = Object.values(row)[1]; //maar ik wil alleen de value van de ingelogde user
      console.log(returned_user); //hoe krijgen we dit in react terug
      
      req.body.user = returned_user;
      console.log(req.body);

      res.redirect("/post_login");
    }
    console.log(returned_user);
  });
});

app.get("/post_login", function(req, res){
  console.log("ingelogd") //als t goed gaat zou ik dit moeten zien in console
  res.status(200).json({
    user: returned_user
  });
  console.log(returned_user);
});

app.listen(81); // start server