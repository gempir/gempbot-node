import mysql from 'mysql';
import cfg   from './../cfg';

var connection = mysql.createConnection({
  host     : cfg.mysql.host,
  user     : cfg.mysql.user,
  password : cfg.mysql.password,
  database : cfg.mysql.database
});

connection.connect(function(err) {
  if (err) {
    console.error('[mysql] error connecting: ' + err.stack);
    return;
  }

  console.log('[mysql] connected as id ' + connection.threadId);
});

module.exports = connection;
