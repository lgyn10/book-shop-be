const express = require('express');
const router = express.Router();
router.use(express.json());

const { allcategories } = require('controller/CategoryController');

//! 전체 카테고리 조회

router.get('/', allcategories);

module.exports = router;
