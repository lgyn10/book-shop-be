const conn = require('data/mariadb');
const { StatusCodes } = require('http-status-codes'); // http-status-codes 라이브러리
require('dotenv').config(); // .env 파일 사용

//! 좋아요 추가
const addLike = (req, res) => {
  const { userId } = req.body;
  const { id: bookId } = req.params;
  const parsedUserId = parseInt(userId);
  const parsedBookId = parseInt(bookId);
  const sql = 'INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?);';
  const values = [parsedUserId, parsedBookId];
  conn.query(sql, values, (error, results) => {
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    return res.status(StatusCodes.OK).json(results);
  });
};

//! 좋아요 취소
const removeLike = (req, res) => {
  const { userId } = req.body;
  const { id: bookId } = req.params;
  const parsedUserId = parseInt(userId);
  const parsedBookId = parseInt(bookId);

  const sql = `DELETE FROM likes 
  WHERE user_id = ? AND liked_book_id = ?;`;
  const values = [parsedUserId, parsedBookId];
  conn.query(sql, values, (error, results) => {
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = { addLike, removeLike };
