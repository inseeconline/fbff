var mysql = require('mysql');
var configMysql = require('./config-local');

//Database connection
var database =  mysql.createConnection(configMysql);
database.connect();

module.exports = database