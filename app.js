const Sequelize = require('sequelize'); //connectie met db
const express = require('express'); // server shit

const app = express();

app.get("/", function(req, res){
  res.send('ey het werkt');
});

const sequelize = new Sequelize({ //kijken of ie mijn test db pakt
  dialect: 'sqlite',
  storage: '/database/test.db'
});

sequelize.authenticate().then(()=> {
  console.log("shit leeft")
}).catch((error)=>{
  console.log(error);
});

app.listen(81); // start server