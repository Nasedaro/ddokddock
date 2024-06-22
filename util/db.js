// db.js
var mysql = require("mysql2");
var dbConfig = {
  host: "localhost",
  user: "root",
  password: "cotmdwl@11",
  database: "ddokddok",
};

var connection = mysql.createConnection(dbConfig);

connection.connect(err => {
  if (err) {
    console.error("데이터베이스 연결 실패: " + err.stack);
    return;
  }
  console.log("데이터베이스 연결 성공");
});

module.exports = connection;
