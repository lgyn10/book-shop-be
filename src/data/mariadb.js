// Get the client
const mysql = require('mysql2');

// Create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root', // pwd 추가
  database: 'Youtube',
  dateStrings: true, // 변경해줘야 time_zone 설정이 적용된 시간을 얻을 수 있다.
});

module.exports = connection;
