const mysql = require('mysql2');

const db = mysql.createConnection(
  {
    host : 'localhost',
    user : 'root',
    password: '6026121603pink',
    database: "employee"
  }
)

module.exports = db;