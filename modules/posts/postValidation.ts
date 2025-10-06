// Converted from .js to .ts — automated lightweight conversion
// NOTE: manual type annotations and refactoring recommended.

import Joi from "joi";



export const postValidation = {
    body: Joi.object()
      .required()
      .keys({
        caption: Joi.string()
       
        .required()
        .messages({ "string.empty": "first name required" }),
          
          }),
      
 
  };