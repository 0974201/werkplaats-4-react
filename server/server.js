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

app.post('/api/saveNewSurvey', bodyParser.json(), async function (req, res) {

    try {
        // starting a SQL transaction
        await runQuery('BEGIN')

        try {
            // inserting a survey and getting the inserted id back
            const surveyId = await insertAndGetLastId("INSERT INTO survey (description, open_date, close_date) VALUES (?, ?, ?)",
                [req.body.description, req.body.openDate, req.body.closeDate])

            // starting a loop to insert every question in the database
            await Promise.all(req.body.questions.map(async function(question, index){

                //check in the question is a open or a multiple choice question
                if (question.type === 'Open') {

                    // inserting a open question and getting the inserted id back so you can use it in the question query
                    const openQuestionId = await insertAndGetLastId("INSERT INTO open_question (question) VALUES (?)",
                        [question.question])

                    // inserting the qusetion with the open question id and getting the question id back
                    const questionId = await insertAndGetLastId("INSERT INTO questions (Open_Question_ID, is_deleted) VALUES (?, ?)",
                        [openQuestionId, false])

                    // insert everythin in the filled_in table to combine everything
                    await runQuery("INSERT INTO filled_in (Survey_ID, Question_ID, question_order, is_reviewed) VALUES (?, ?, ?, ?)",
                        [surveyId, questionId, index, false],)

                } else if (question.type === 'MultipleChoice') {

                } else {
                    console.log('wrong type of question')
                }
            }))
            // commit the started SQL transaction
            await runQuery('COMMIT');

        } catch (error) {
            // incase of a erron rollback the SQL transaction
            await runQuery('ROLLBACK');
            console.log(error)
        }
    } catch (error) {

    }
    // Helper function to put a insert and a last id together
    async function insertAndGetLastId(query, param) {
        await runQuery(query, param)
        return  await getLastInsertedId()
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
