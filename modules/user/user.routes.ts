// Converted from .js to .ts — automated lightweight conversion
// NOTE: manual type annotations and refactoring recommended.

import { Router } from "express";
import *  as user_controller from './user.controller.js'
import { validation } from '../../middleware/validation.js';
import { changePassValidation, loginValidation, resetPasswordvalidation, signupValidation } from "./user.validation.js";
import { errorHandling } from '../../utils/errorhandling.js';
import { auth } from '../../middleware/Authintication.js';
import {  multerFunctionCoudinary, validationObject } from "../../services/multer.js";

const router= Router();
router.post('/signup' ,validation(signupValidation) , errorHandling(user_controller.signup)) ;
router.get('/confirmemail/:token',errorHandling( user_controller.confirmemail))
router.post('/login',validation(loginValidation),errorHandling( user_controller.login));
router.post('/forgetpassword',errorHandling(user_controller.forgetPassword) );
router.post ('/resetpass/:userid',validation(resetPasswordvalidation),errorHandling(user_controller.resetPassword))
router.post('/changepass', auth(),validation(changePassValidation), errorHandling(user_controller.changePassword))
router.patch('/profilePic', auth(),multerFunctionCoudinary({filevalidation:validationObject.image}).single('image'),errorHandling(user_controller.profilePicture))
router.delete('/softdelet',auth(),errorHandling(user_controller.softDelete))
router.delete('/delete',auth(),errorHandling(user_controller.deleteUser))
router.patch('/logout',auth(),errorHandling(user_controller.logout))






export default router