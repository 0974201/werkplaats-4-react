const sqlite3 = require("sqlite3").verbose();
const path = require('node:path');
const db_file = path.resolve(__dirname, "./database/test.db");

function db(){
  const db = new sqlite3.Database(db_file, sqlite3.OPEN_READWRITE, (error) => {
    if(error && error.code == "SQLITE_CANTOPEN") {
      console.info("creating new database");
      createDB();
      return;
    } else if(error) {
      return console.error(error.message);  
    } else {
      console.info("yo");
    }
  });
  return db;
}

function createDB(){
  const new_file = path.resolve(__dirname, "./database/test_date.db");
  let new_db = new sqlite3.Database(new_file, (error) => {
    if(error) {
      return console.error(error);
    }
    createTables(new_db);
  });
}

function createTables(new_db){
  let question = `
  CREATE TABLE questions(
    Question_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    is_deleted BOOLEAN DEFAULT (0),
    Open_Question_ID REFERENCES open_question (Open_Question_ID),
    Multiple_Choice_ID REFERENCES multiple_choice (Multiple_Choice_ID)
  );`;

  let open_question = `
  CREATE TABLE open_question(
    Open_Question_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT (255)
  );`;

  let multiple_choice =  `
  CREATE TABLE multiple_choice(
    Multiple_Choice_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT (255),
    Option_ID REFERENCES option (Option_ID)
  );`;

  let option = `
  CREATE TABLE option(
    Option_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    option TEXT (255)
  );`;

  let option_row = `
  CREATE TABLE option_row(
    Option_ID REFERENCES option (Option_ID),
    Multiple_Choice_ID REFERENCES multiple_choice (Multiple_Choice_ID)
  );`;

  let survey = `
  CREATE TABLE survey(
    Survey_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT (255),
    open_date TEXT (50),
    close_date TEXT (50)
  );`;

  let filled_in = `
  CREATE TABLE filled_in(
    date_answered TEXT (50),
    answer TEXT (255),
    question_order INTEGER (100),
    is_reviewed BOOLEAN DEFAULT (0),
    Question_ID REFERENCES question (Question_ID),
    Survey_ID REFERENCES survey (Survey_ID),
    User_ID REFERENCES user (User_ID)
  );`;

  let user = `
  CREATE TABLE user(
    User_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    type INT (1),
    is_anonymous BOOLEAN DEFAULT (0),
    Login_ID REFERENCES login(Login_ID)
  );`;

  let login = `
  CREATE TABLE login(
    Login_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT (255),
    password VARCHAR (255)
  );`;
  
  new_db.exec(open_question);
  new_db.exec(option);
  new_db.exec(multiple_choice);
  new_db.exec(option_row);
  new_db.exec(question);
  new_db.exec(survey);
  new_db.exec(login);
  new_db.exec(user);
  new_db.exec(filled_in);
}

module.exports = db();