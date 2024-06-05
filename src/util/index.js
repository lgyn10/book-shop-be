const jwt = require('jsonwebtoken'); // jwt 모듈 소환
require('dotenv').config(); // .env 파일 사용

// ensureAuthorization 함수
const ensureAuthorization = (req, res) => {
  try {
    const receivedJwt = req.headers['authorization'];
    const decodedJwt = jwt.verify(receivedJwt, process.env.JWT_PRIVATE_KEY);
    console.log('receivedJwt: ', receivedJwt);
    console.log('decodedJwt: ', decodedJwt);
    return decodedJwt;
  } catch (err) {
    return err;
  }
};

module.exports = { ensureAuthorization };
