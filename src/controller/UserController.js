const conn = require('data/mariadb');
const { StatusCodes } = require('http-status-codes'); // http-status-codes 라이브러리
// jwt, cookie 설정
const jwt = require('jsonwebtoken');
require('dotenv').config(); // .env 파일 사용
require('cookie-parser');

//! 회원가입
const join = (req, res) => {
  const { email, password } = req.body;
  const sql = `insert into users (email, password) values ('${email}','${password}')`;
  conn.query(sql, (error, results) => {
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    if (results.affectedRows > 0) {
      res.status(StatusCodes.CREATED).json(`${email}님, 회원가입에 성공했습니다!`);
    }
    res.status(StatusCodes.CREATED).json(`${email}님, 회원가입에 성공했습니다!`);
    console.log(results);
  });
};

//! 로그인
const login = (req, res) => {
  const { email, password } = req.body;
  const sql = `SELECT * FROM users where email = ?`;
  conn.query(sql, [email], (error, results) => {
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    // 로직
    const loginUser = results[0];
    if (loginUser && loginUser.password === password) {
      // jwt 토큰 발행
      const token = jwt.sign({ email: loginUser.email }, process.env.JWT_PRIVATE_KEY, {
        expiresIn: '15m',
        issuer: 'changyunlee',
      });
      // 쿠키 발행
      res.cookie('token', token, { httpOnly: true });
      res.status(StatusCodes.OK).json({ message: `${loginUser.email}님, 로그인에 성공했습니다.` });
      console.log(token); // token 확인
    } else {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: `로그인 실패! 이메일이나 비밀번호를 확인하세요.` });
      // 401: 미인증.서버가 누구인지 모름, 403: 접근 권한 없음. 서버가 누구인지 알고 있음
    }
  });
};

//! 비밀번호 수정 요청
const passwordResetReq = (req, res) => {
  const email = req.body.email;
  const sql = `SELECT * FROM users where email = ?`;
  conn.query(sql, [email], (error, results) => {
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message }).end();
    const userResult = results[0];
    if (userResult) {
      res.status(StatusCodes.OK).json({ message: `사용자 정보가 확인되었습니다`, email: userResult.email }).end();
    } else {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: `사용자 정보가 없습니다.` }).end();
    }
  });
};
