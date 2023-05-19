const express = require('express'); // express
const routes = require('./../controllers/controller.js');

const router = express.Router(); // router

router.get('/tezt', routes.getGames);
console.log(routes.getGames);

module.exports = router;