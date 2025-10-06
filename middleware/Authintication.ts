// Converted from .js to .ts — automated lightweight conversion
// NOTE: manual type annotations and refactoring recommended.


import userModel from "../Db/models/user.model.js";
import { errorHandling } from "../utils/errorhandling.js";
import { tokenDecode } from "../utils/tokenfunction.js";

 const authuntication =async (req,res,next) => {

    const {authorization} = req.headers;


        if(!authorization){
            return res.status(401).json({message: 'No token provided'})
          }else{
              if (!authorization.startsWith(process.env.TOKEN_PRIFIX)) {
                  return res.json({message:'wrong token prefix'})
              }
              const token = authorization.split('__')[1];
              const decoded= tokenDecode({payload:token});
              
              if(!decoded || !decoded.id){
                  return res.status(401).json({message: 'Invalid token'})
              }
              const user = await userModel.findById(decoded.id);
              if(!user){
                  return res.status(401).json({message: 'user not exist any more'})
              }else{
                  req.user = user;
                  next();
              }
          }
 
   

  
}


export const auth = () => {
    return errorHandling(authuntication);
  };
