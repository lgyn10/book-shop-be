const express = require('express');
const router = express.Router();

router.use(express.json());

const { order, getOrders, getOrderDetail } = require('controller/OrderController');

//! 결제하기 = 주문등록 = 데이터베이스 주문 insert
router.post('/', order);

//! 주문 목록 조회
router.get('/', getOrders);

//! 주문 상세 상품 조회
router.get('/:id', getOrderDetail);

module.exports = router;
