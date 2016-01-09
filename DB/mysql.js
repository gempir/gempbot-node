var mysql = require('mysql');
var cfg   = require('./../cfg');

var dbOptions = cfg.dbOptions;

var db = mysql.createConnection({
	host: dbOptions.host,
	user: dbOptions.user,
	password: dbOptions.password,
	database: dbOptions.database
});

db.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});

module.exports = 
{
	db
}