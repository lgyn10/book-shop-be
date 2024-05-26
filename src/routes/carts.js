const { addCartItem, getCartItems, deleteCartItem, getSelectedCartItems } = require('controller/CartController');
const express = require('express');
const router = express.Router();

router.use(express.json());

//! 장바구니 담기(추가)
router.post('/', addCartItem);

//! 장바구니 도서 전체 조회
router.get('/', getCartItems);

//! 장바구니 도서 개별 삭제
router.delete('/:cartItemId', deleteCartItem);

//! 장바구니에서 선택한 주문 상품 목록 조회
router.get('/', getSelectedCartItems);

module.exports = router;
