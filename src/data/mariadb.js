const mysql = require('mysql2');

// 데이터베이스와 연동
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root', // pwd 추가
  database: 'BookShop',
  dateStrings: true, // 변경해줘야 time_zone 설정이 적용된 시간을 얻을 수 있다.
});

module.exports = connection;
