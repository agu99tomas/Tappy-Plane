const mysql = require("mysql");

var connection = mysql.createPool({
  host: "localhost",
  database: 'tappy_plane',
  user: "root",
  password: ''
});

module.exports = connection;
