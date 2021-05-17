const jwt = require('jsonwebtoken');
const { Jwt } = require('../utils/constants');

// Refresh Tokens
let validTokens = [];
//decodes the token that is passed
authMW = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (validTokens.includes(token)==false || validTokens.includes(token)==null || validTokens.length==0 || validTokens.includes(token)==undefined || !token) {
    return res.status(401).json({ "Security Message": "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, Jwt.SECRET);
    req.user = decoded.user; //attach user(embeded in token) with the request object and pass it to next middleware

    // ==== CRITEREA:: Expires Token after 60 seconds of Inactivity ====
    extendToken(decoded);
    // console.log(Math.round(new Date() / 1000));
    
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

const addToken = token => {
  validTokens.push(token);
  return ;
}
const expireToken = token => {
  validTokens = validTokens.filter(token2delete => token2delete !== token);
  return ;
}
const extendToken = currentToken  => {

  // Logic of Token Extension ======
  // iat(issuedat)=current time
  // exp=iat+60 seconds

  // === Code ===
  currentToken.iat=Math.round(new Date()/1000);
  // Below is Expiration Time = 60 seconds
  currentToken.exp=currentToken.iat+60;

}
module.exports = {
  authMW: authMW,
  addToken: addToken,
  expireToken: expireToken
};