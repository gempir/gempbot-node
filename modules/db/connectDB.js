var mysql = require('mysql');
var cfg   = require('./../../cfg');

var db = mysql.createConnection({
  host: cfg.db.host,
  user: cfg.db.user,
  password: cfg.db.password,
  database: cfg.db.database
});

db.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Database connected');
});

function select(query, parameters, callback) 
{
    db.query(query, parameters,function(err,rows){
        if(err) throw err;
        return callback(rows);
    });
}

function update(query, parameters, callback) 
{
    db.query(query, parameters,function(err,result){
        if(err) throw err;
        return callback(result);
    });
}


module.exports = 
{
	select,
	update
}