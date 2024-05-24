const conn = require('data/mariadb');
const { StatusCodes } = require('http-status-codes'); // http-status-codes 라이브러리
require('dotenv').config(); // .env 파일 사용

//! 카테고리 전체 조회
const allcategory = (req, res) => {
  const sql = 'select * from category';
  conn.query(sql, (error, results) => {
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = { allcategory };
