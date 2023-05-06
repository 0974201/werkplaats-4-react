const sqlite3 = require("sqlite3").verbose();
const db_file = "./database/db/test.db";

function db(){
  const db = new sqlite3.Database(db_file, (error) => {
    if(error) {
      return console.error(error.message);
    }
  });
  console.info("yo");
  return db
}

module.exports = db();