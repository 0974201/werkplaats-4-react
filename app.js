// server shit
const http = require('http');

const hostname = '127.0.0.1';
const port = 81;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Het leeft!!!!');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


//connectie met db
const Sequelize = require('sequelize');

const sequelize = new Sequelize({ //kijken of ie mijn test db pakt
  dialect: 'sqlite',
  storage: '/database/test.db'
});

sequelize.authenticate().then(()=> {
  console.log("shit leeft")
}).catch((error)=>{
  console.log(error);
});

