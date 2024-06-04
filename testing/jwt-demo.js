const jwt = require('jsonwebtoken'); // jwt 모듈 소환
const dotenv = require('dotenv');
dotenv.config();

// 서명 = 토큰 발행
const token = jwt.sign({ foo: 'bar' }, process.env.JWT_PRIVATE_KEY);
// token 생성 = jwt 서명을 했다! (페이로드, 나만의 암호키) + SHA256

console.log(token);

//! 검증
// 만약 검증에 성공하면, 페이로드 값을 확인할 수 있음
const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
console.log(decoded);
