require('dotenv').config();
const sqlite3 = require("sqlite3").verbose();
// const path = require('node:path');
// const db_file = path.resolve(__dirname, "./database/test.db"); //uncomment deze regels als de /env bestand ontbreekt.
const db_file = process.env.DB_PATH;

function db() {
  return new sqlite3.Database(db_file, sqlite3.OPEN_READWRITE, (error) => {
    if (error && error.code === "SQLITE_CANTOPEN") {
      console.info("creating new database");
      createDB()
    } else if (error) {
      return console.error(error.message);
    } else {
      console.info("database zegt hoi :)");
    }
  });
}

function createDB(){
  //const new_file = path.resolve(__dirname, "./database/test_data.db"); //uncomment deze regel als de /env bestand ontbreekt.
  const new_file = process.env.NEW_DB;
  let new_db = new sqlite3.Database(new_file, (error) => {
    if (error) {
      return console.error(error);
    }
    createTables(new_db);
    populateTables(new_db);
  });
}

function createTables(new_db) {
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
    open_question TEXT (255)
  );`;

  let multiple_choice = `
  CREATE TABLE multiple_choice(
    Multiple_Choice_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    multi_question TEXT (255)
  );`;

  let option = `
  CREATE TABLE option(
    Option_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    option TEXT (255)
  );`;

  let option_row = `
  CREATE TABLE option_row(
    Option_ID REFERENCES option (Option_ID),
    Multiple_Choice_ID REFERENCES multiple_choice (Multiple_Choice_ID),
    option_order INTEGER (100)
  );`;

  let survey = `
  CREATE TABLE survey(
    Survey_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT (255),
    description TEXT (255),
    open_date TEXT (50),
    close_date TEXT (50),
    can_be_anonymous BOOLEAN DEFAULT (1),
    is_reviewed BOOLEAN DEFAULT (0)
  );`;

  let filled_in = `
  CREATE TABLE filled_in(
    date_answered TEXT (50),
    answer TEXT (255),
    question_order INTEGER (100),
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

function populateTables(new_db){
  let openq = `INSERT INTO open_question (open_question) VALUES ("avocado?")`;
  let openq_ID = `INSERT INTO questions (Open_Question_ID, is_deleted) VALUES (1, 0)`;
  let multiq = `INSERT INTO multiple_choice (multi_question) VALUES ("dit is een vraag")`;
  let multiq_Option = `INSERT INTO option (option) VALUES ("256")`;
  let optionrow = `INSERT INTO option_row (Multiple_Choice_ID, Option_ID, option_order) VALUES (1, 1, 1)`;
  let multiq_ID = `INSERT INTO questions (Multiple_Choice_ID, is_deleted) VALUES (1, 0)`;
  let survey_birb = `INSERT INTO survey (title, description, open_date, close_date, can_be_anonymous, is_reviewed) VALUES ("vogels zijn gaaf", "fluffy birb", 2023-04-30, 2023-06-17, 0, 0)`;
  let survey = `INSERT INTO survey (title, description, open_date, close_date, can_be_anonymous, is_reviewed) VALUES ("bepis", "", 2023-06-17, 2023-07-14, 1, 1)`;
  let login1 = `INSERT INTO login (email, password) VALUES ("phoenixwright@hotmail.com", "objection!")`;
  let login2 = `INSERT INTO login (email, password) VALUES ("efsefse@hotmail.com", "aaaaa")`;

  new_db.exec(openq);
  new_db.exec(openq_ID);
  new_db.exec(multiq);
  new_db.exec(multiq_Option);
  new_db.exec(optionrow);
  new_db.exec(multiq_ID);
  new_db.exec(survey_birb);
  new_db.exec(survey);
  new_db.exec(login1);
  new_db.exec(login2);
}

module.exports = db();
