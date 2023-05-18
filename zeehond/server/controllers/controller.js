const sqlite3 = require("sqlite3").verbose();
const db = require('../db.js');


async function getGaem(req, res) {
  db.all('SELECT * FROM games', (err, row) => {
    if (err){
      throw new Error(err.message);
    }
    console.log(row);
    res.json(row);
  });
}

exports.getGames = async (req, res) => {
  db.all('SELECT * FROM games', (err, row) => {
    if (err){
      throw new Error(err.message);
    }
    console.log(row);
    res.json(row);
  });
}

//exports.getBirb = getBirb();
//exports. = getGaem();
//module.exports = {getBirb(), getGaem()};
module.exports.getGaem = getGaem;