const jwt = require('jsonwebtoken'); // jwt 모듈 소환
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const { StatusCodes } = require('http-status-codes');
dotenv.config();
app.listen(3000);

// 토큰 발행
app.get('/jwt', (req, res) => {
  const token = jwt.sign({ foo: 'bar' }, process.env.JWT_PRIVATE_KEY, { expiresIn: '10s' });
  res.cookie('testingJwt', token, { httpOnly: true }).send('토큰 발행 완료');
  console.log(token);
});

// 토큰 검증
app.get('/jwt/decoded', (req, res) => {
  try {
    const jwtToken = req.headers['authorization'];
    const decoded = jwt.verify(jwtToken, process.env.JWT_PRIVATE_KEY);
    res.status(StatusCodes.OK).send(decoded);
  } catch (err) {
    // 에러 처리
    res.status(StatusCodes.UNAUTHORIZED).send(err);
    console.log('재로그인 요망');
  }
});
