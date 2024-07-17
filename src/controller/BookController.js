const conn = require('data/mariadb');
const mysql = require('mysql2/promise');
const { StatusCodes } = require('http-status-codes'); // http-status-codes 라이브러리
require('dotenv').config(); // .env 파일 사용
const { ensureAuthorization } = require('util/index');

const { camelcase } = require('camelcase-input');

//! 전체 도서 조회
const allBooks = async (req, res) => {
  //| 페이지네이션 위한 totalCount 값 추출
  // 비동기 전처리
  const promiseConn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PRIVATE_KEY, // pwd 추가
    database: 'BookShop',
    dateStrings: true, // 변경해줘야 time_zone 설정이 적용된 시간을 얻을 수 있다.
  });

  const { categoryId, news, limit, currentPage } = req.query; // 존재 안하면 [undefined]
  // limit : page 당 도서 수
  // currentPage : 현재 몇 페이지
  // offset : limit * (currentPage - 1)

  // string -> number 형 변환
  const parsedLimit = parseInt(limit, 10); // NaN or value
  const parsedCurPage = parseInt(currentPage, 10);
  const offset = parsedLimit * (parsedCurPage - 1);
  const parsedCategoryId = parseInt(categoryId, 10);

  const parsedNews = news === 'true' ? true : false;

  // 전체 조회
  let sql = `select SQL_CALC_FOUND_ROWS *, 
  (SELECT count(*) FROM likes where liked_book_id = id) as likes
  from books`;
  // (SELECT EXISTS (SELECT * FROM likes WHERE user_id = user_id and liked_book_id = id)) as liked
  let values = [];

  //| 조건 분기

  //! 카테고리별 + 신간 도서 조회
  if (parsedCategoryId && parsedNews) {
    // sql문 더할 때, 공백 처리 필수
    sql += ` WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`;
    values = [...values, parsedCategoryId];
  } else if (parsedCategoryId === 0 || parsedCategoryId) {
    //! 카테고리별 도서 조회
    sql += ` where category_id = ?`;
    values = [...values, parsedCategoryId];
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
  const [rows1] = await promiseConn.execute(`SELECT count(*) as totalCount FROM BookShop.books;`);
  console.log(rows1);
  // const [rows1] = await promiseConn.execute(`SELECT FOUND_ROWS();`);
  //console.log(rows1[0]['FOUND_ROWS()']);

  const [rows2, fileds2] = await promiseConn.execute(sql, values);
  if (rows2.length) {
    const results = {
      books: rows2,
      pagination: {
        currentPage: parsedCurPage,
        totalCount: rows1[0].totalCount,
        //totalCount: rows1[0]['FOUND_ROWS()'],
      },
    };
    return res.status(StatusCodes.OK).json(camelcase(results, { deep: true }));
  } else {
    return res.status(StatusCodes.NOT_FOUND).json({ totalCount: rows1[0].totalCount }).end();
  }
};

//! 개별 도서 조회
const bookDetail = (req, res) => {
  const authorization = ensureAuthorization(req, res);

  let sql;
  let values;

  const bookId = parseInt(req.params.id);

  if (authorization instanceof Error) {
    // 비로그인 시 - liked을 뺀 요청값 리턴
    sql = `select b.*, c.name AS category_name,
   (SELECT count(*) FROM likes where liked_book_id = b.id) as likes 
   from books as b
   left join category as c
   on b.category_id = c.id
   where b.id = ?`;
    values = [bookId];
  } else {
    // 로그인 시 - 유저의 liked를 포함한 요청값을 리턴
    sql = `select b.*, c.name AS category_name,
    (SELECT count(*) FROM likes where liked_book_id = b.id) as likes,
    (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? and liked_book_id = b.id)) as liked
    from books as b
    left join category as c
    on b.category_id = c.id
    where b.id = ?`;
    values = [authorization.userId, bookId];
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

module.exports = { allBooks, bookDetail };
