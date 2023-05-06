const db = require('../database/db.js');

export function getBirb(){ //uhh gaat dit werken?
  db.all('SELECT * FROM vogels', (err, row) => {
    if (err){
      console.log(err.message);
    }
    console.log(row);
    res.json(row);
  });
}

export function getGaem(){
  db.all('SELECT * FROM games', (err, row) => {
    if (err){
      console.log(err.message);
    }
    console.log(row);
    res.json(row);
  });
}

//module.exports = getGaem(), getBirb();