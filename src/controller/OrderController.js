// const conn = require('data/mariadb');
const mysql = require('mysql2/promise');
const { StatusCodes } = require('http-status-codes'); // http-status-codes 라이브러리
require('dotenv').config(); // .env 파일 사용

//! 결제하기 = 주문등록 = 데이터베이스 주문 insert
const order = async (req, res) => {
  // 비동기 전처리
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PRIVATE_KEY, // pwd 추가
    database: 'BookShop',
    dateStrings: true, // 변경해줘야 time_zone 설정이 적용된 시간을 얻을 수 있다.
  });

  const { items, delivery, totalPrice, totalQuantity, userId, representBookTitle } = req.body;
  let delivery_id;
  let order_id;

  //| 1. delivery 테이블 삽입
  const sql1 = `INSERT INTO delivery (address, receiver, contact) 
    VALUES (?, ?, ?);`;
  const values1 = [delivery.address, delivery.receiver, delivery.contact];
  // resolve(results)??
  let [results] = await conn.execute(sql1, values1);
  const delivery_id = results.insertId;

  //| 2. order 테이블 삽입
  const sql2 = `INSERT INTO orders (represent_book_title, total_quantity, total_price, user_id, delivery_id) 
    VALUES (?, ?, ?, ?, ?);`;
  const values2 = [representBookTitle, totalPrice, totalQuantity, userId, delivery_id];
  [results] = await conn.execute(sql2, values2);
  const order_id = results.insertId;

  //| 3. orderedBook 테이블 삽입
  // 전처리 - items를 가지고, 장바구니에서 book_id, quantity 조회
  const preSql = `SELECT book_id, quantity from cart_items where id in (?)`;
  const [orderItems] = await conn.query(preSql, [items]);

  const sql3 = `INSERT INTO ordered_book (order_id, book_id, quantity) VALUES ?;`;
  // items.. 베열 : 요소들을 하나씩 꺼내서 forEact 문으로 돌려 values를 만들어 sql 문 던지기
  const values3 = [];
  orderItems.forEach((item) => values3.push([order_id, item.book_id, item.quantity]));
  results = await conn.query(sql3, [values3]); // execute는 아직 다중 값을 sql을 받아올 수 없음

  //| 4. cartItems 요소 삭제
  const deleteCartItems = async (conn, items) => {
    const sql = `DELETE FROM cart_items WHERE id IN (?)`;
    let results = await conn.query(sql, [items]);
    return results;
  };
  results = await deleteCartItems(conn, items);

  return res.status(StatusCodes.OK).json(results);
};

//! 주문 목록 조회
const getOrders = async (req, res) => {
  // 비동기 전처리
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PRIVATE_KEY, // pwd 추가
    database: 'BookShop',
    dateStrings: true, // 변경해줘야 time_zone 설정이 적용된 시간을 얻을 수 있다.
  });

  const { userId } = req.body;
  const parsedUserId = parseInt(userId, 10);

  const sql = `SELECT o.*, d.address, d.receiver, d.contact FROM orders as o
  LEFT JOIN delivery as d
  ON o.delivery_id = d.id
  WHERE o.user_id = ?`;
  const values = [parsedUserId];

  const [results] = await conn.query(sql, values);
  return res.status(StatusCodes.OK).json(results);
};

//! 주문 상세 상품 조회
const getOrderDetail = (req, res) => {};

module.exports = { order, getOrders, getOrderDetail };