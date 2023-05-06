const { Sequelize, DataTypes, Model }  = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Test = sequelize.define('Test', {
    
});