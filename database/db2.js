const knex = require('knex')({
  client: 'sqlite3',
  connection: {
      filename: "./database/test.db"
    },
    useNullAsDefault: true
});

module.exports = knex;