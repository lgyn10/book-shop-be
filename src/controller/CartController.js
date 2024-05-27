const conn = require('data/mariadb');
const { StatusCodes } = require('http-status-codes'); // http-status-codes 라이브러리
require('dotenv').config(); // .env 파일 사용

//! 장바구니 도서 추가(담기)
const addCartItem = (req, res) => {
  const { userId, bookId, quantity } = req.body;
  const parsedUserId = parseInt(userId, 10);
  const parsedBookId = parseInt(bookId, 10);
  const parsedQuantity = parseInt(quantity, 10);

  const sql = `INSERT INTO cart_items (user_id, book_id, quantity) VALUES (?, ?, ?);`;
  const values = [parsedUserId, parsedBookId, parsedQuantity];

  conn.query(sql, values, (error, results) => {
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    return res.status(StatusCodes.OK).json(results);
  });
};

//! 장바구니 도서 전체 조회 + 장바구니에서 선택한 도서 조회
const getCartItems = (req, res) => {
  const { userId, selected } = req.body;
  const parsedUserId = parseInt(userId, 10);
  const parsedSelected = selected.map(Number);

  let sql = `SELECT b.*, ci.id as cart_items_id, ci.quantity
  FROM books AS b
  LEFT JOIN cart_items AS ci ON b.id = ci.book_id
  WHERE ci.user_id = ?`;
  let values = [parsedUserId];

  // 장바구니에서 선택한 도서 조회
  if (selected.length > 0) {
    sql += ` AND ci.id IN (?);`;
    values = [...values, parsedSelected];
  }

  conn.query(sql, values, (error, results) => {
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    return res.status(StatusCodes.OK).json(results);
  });
};

//! 장바구니 도서 개별 삭제
const deleteCartItem = (req, res) => {
  const { cartItemId } = req.params;
  const parsedCartItemId = parseInt(cartItemId, 10);
  const sql = `DELETE FROM cart_items WHERE id = ?`;
  const values = [parsedCartItemId];
  conn.query(sql, values, (error, results) => {
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = { addCartItem, getCartItems, deleteCartItem };
