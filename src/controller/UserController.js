const conn = require('data/mariadb');
// http-status-codes 라이브러리
const { StatusCodes } = require('http-status-codes');

const join = (req, res) => {
  const { email, password } = req.body;
  const sql = `insert into users (email, password) values ('${email}','${password}')`;
  conn.query(sql, (error, results) => {
    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
    res.status(StatusCodes.CREATED).json(`${email}님, 회원가입에 성공했습니다!`);
    console.log(results);
  });
};

module.exports = { join };
