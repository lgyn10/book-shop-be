const express = require('express');
const router = express.Router();
router.use(express.json());

const { allcategory } = require('controller/CategoryController');

//! 전체 카테고리 조회

router.get('/', allcategory);

module.exports = router;
