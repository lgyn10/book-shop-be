const express = require('express');
const router = express.Router();

router.use(express.json());

//! 결제하기 = 주문등록 = 데이터베이스 주문 insert
router.post('/', (req, res) => {});

//! 주문 목록 조회
router.get('/', (req, res) => {});

//! 주문 상세 상품 조회
router.get('/:id', (req, res) => {});

module.exports = router;
