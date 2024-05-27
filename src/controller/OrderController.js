const conn = require('data/mariadb');
const { StatusCodes } = require('http-status-codes'); // http-status-codes 라이브러리
require('dotenv').config(); // .env 파일 사용

//! 결제하기 = 주문등록 = 데이터베이스 주문 insert
const order = (req, res) => {
  //   {
  //     items : [ {cartId, bookId, quantity},   {cartId, bookId, quantity}, …] ,
  //     delivery : { address, receiver, contact},
  //     totalPrice : 총금액,
  //     totalQuantity : 총수량,
  //     userId : jwt 활용 전까지 사용
  //  }
  const { items, delivery, totalPrice, totalQuantity, userId, representBookTitle } = req.body;
  let delivery_id = 2;
  let order_id = 2;
  const sql = `INSERT INTO delivery (address, receiver, contact) 
  VALUES (?, ?, ?);`;
  const values = [delivery.address, delivery.receiver, delivery.contact];

  // conn.query(sql, values, (error, results) => {
  //   if (error) return res.status(StatusCodes.BAD_REQUEST).json({ message: error });
  //   delivery_id = 2; // results.insertId;

  //   return res.status(StatusCodes.OK).json(results);
  // });

  const sql2 = `INSERT INTO orders (represent_book_title, total_quantity, total_price, user_id, delivery_id) 
  VALUES (?, ?, ?, ?, ?);`;
  const values2 = [representBookTitle, totalPrice, totalQuantity, userId, delivery_id];
  // conn.query(sql2, values2, (error, results) => {
  //   if (error) return res.status(StatusCodes.BAD_REQUEST).json({ message: error });
  //   order_id = results.insertId;
  //   console.log(order_id);
  //   return res.status(StatusCodes.OK).json(results);
  // });

  // INSERT INTO orderedBook (order_id, book_id, quantity)
  // VALUES (order_id, 1, 1);
  // INSERT INTO orderedBook (order_id, book_id, quantity)
  // VALUES (order_id, 3, 2);
  const sql3 = `INSERT INTO ordered_book (order_id, book_id, quantity) VALUES ?;`;
  // items.. 베열 : 요소들을 하나씩 꺼내서 forEact 문으로 돌려 values를 만들어 sql 문 던지기
  const values3 = [];
  items.forEach((item) => {
    values3.push([order_id, item.book_id, item.quantity]);
  });
  // insert 벌킹
  conn.query(sql3, [values3], (error, results) => {
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ message: error });
    return res.status(StatusCodes.OK).json(results);
  });
};

//! 주문 목록 조회
const getOrders = (req, res) => {};

//! 주문 상세 상품 조회
const getOrderDetail = (req, res) => {};

module.exports = { order, getOrders, getOrderDetail };
