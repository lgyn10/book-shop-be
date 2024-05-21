const express = require('express');
const router = express.Router();
router.use(express.json());
// 유효성 검사 라이브러리
const { body, param, validationResult } = require('express-validator');

// UserController
// const { join, login, passwordResetReq, passwordReset } = require('controller/UserController');
const userController = require('controller/UserController');

// 유효성 검사 예외 처리 모듈
const validateErrHandler = (req, res, next) => {
  const err = validationResult(req);
  if (err.isEmpty()) {
    return next();
  }
  return res.status(400).json({ message: err.errors });
};

//! 회원가입
router.post(
  '/join',
  [
    body('email').notEmpty().isEmail().withMessage('email 형식이 아닙니다.'),
    body('password').notEmpty().withMessage('비밀번호를 입력하세요.').isString(),
    validateErrHandler,
  ],
  userController.join
);

//! 로그인
router.post('/login', userController.login);

//! 비밀번호 초기화 요청
router.post('/reset', userController.passwordResetReq);

//! 비밀번호 초기화 실행
router.put('/reset', userController.passwordReset);

module.exports = router;
