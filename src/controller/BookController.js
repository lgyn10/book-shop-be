const conn = require('data/mariadb');
const { StatusCodes } = require('http-status-codes'); // http-status-codes 라이브러리
require('dotenv').config(); // .env 파일 사용

//! 전체 도서 조회
const allBooks = (req, res) => {
  const { categoryId, news, limit, currentPage } = req.query; // 존재 안하면 [undefined]
  // limit : page 당 도서 수
  // currentPage : 현재 몇 페이지
  // offset : limit * (currentPage - 1)

  // string -> number 형 변환
  const parsedLimit = parseInt(limit, 10); // NaN or value
  const parsedCurPage = parseInt(currentPage, 10);
  const offset = parsedLimit * (parsedCurPage - 1);
  const parsedcategoryId = parseInt(categoryId, 10);

  // news : string -> boolean 형 변환
  const parsedNews = JSON.parse(news ?? false);

  // 전체 조회
  let sql = `select * from books`;
  let values = [];

  //| 조건 분기

  //! 카테고리별 + 신간 도서 조회
  if (parsedcategoryId && parsedNews) {
    // sql문 더할 때, 공백 처리 필수
    sql += ` WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
    values = [...values, parsedcategoryId];
  } else if (parsedcategoryId) {
    //! 카테고리별 도서 조회
    sql += ` where category_id = ?`;
    values = [...values, parsedcategoryId];
  } else if (parsedNews) {
    //! 신간 도서 조회
    sql += ` where pub_date
      between DATE_SUB(NOW(), interval 1 month) and NOW()`;
  }
  // 페이지네이션
  if (parsedLimit && parsedCurPage) {
    sql += ` limit ? offset ?`;
    values = [...values, parsedLimit, offset];
  }

  conn.query(sql, values, (error, results) => {
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    if (results.length) {
      return res.status(StatusCodes.OK).json(results);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  });
};

//! 개별 도서 조회
const bookDetail = (req, res) => {
  const id = parseInt(req.params.id);
  const sql = `select b.*, c.name AS category_name from books as b
  left join category as c
  on b.category_id = c.id
  where b.id = ?`;
  const values = [id];
  conn.query(sql, values, (error, results) => {
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    if (results.length) {
      return res.status(StatusCodes.OK).json(results);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  });
};

module.exports = { allBooks, bookDetail };
