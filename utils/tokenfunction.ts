// Converted from .js to .ts — automated lightweight conversion
// NOTE: manual type annotations and refactoring recommended.

import jwt from "jsonwebtoken";
// generate token 
export const tokenGenerator = ({
    payload={},
    signature = process.env.TOKEN_KEY,
    expiresIn = '1hour'
} ={}) => {
  if (Object.keys(payload).length) {
    const token = jwt.sign(payload,signature,{expiresIn});
    return token ;
  }
  return false;
}

// decode token 
export const tokenDecode = ({
    payload='',
    signature = process.env.TOKEN_KEY,

} ={}) => {
  if (!payload) {
    return false;
  
  }
  const decode = jwt.verify(payload,signature);
  return decode 
}
