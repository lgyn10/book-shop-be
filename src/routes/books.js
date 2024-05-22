const express = require('express');
const router = express.Router();
router.use(express.json());

const { allBooks, bookDetail, booksByCategory } = require('controller/BookController');

//! 전체 도서 조회
//| +카테고리별 도서 조회
router.get('/', allBooks);

//! 개별 도서 조회
router.get('/:id', bookDetail);

module.exports = router;
