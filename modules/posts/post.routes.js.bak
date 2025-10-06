import { Router } from "express";
const router= Router();
import * as post_controller from './post.controller.js'
import { auth } from "../../middleware/Authintication.js";
import { errorHandling } from './../../utils/errorhandling.js';
import { multerFunctionCoudinary, validationObject } from "../../services/multer.js";
import { validation } from './../../middleware/validation.js';
import { postValidation } from "./postValidation.js";


router.post('/addwithimage',auth(),multerFunctionCoudinary({filevalidation:validationObject.image}).single('image'),validation(postValidation),errorHandling(post_controller.addPostWithimage))
router.post('/add',auth(),validation(postValidation),errorHandling(post_controller.addPostNoImage))
router.get('/',auth(),errorHandling(post_controller.getAllPosts))
router.get('/profile',auth(),errorHandling(post_controller.profilPosts))
router.delete('/delete/:postid',auth(),errorHandling(post_controller.deletePost))
router.patch('/like/:PostId',auth(),errorHandling(post_controller.likePost))
router.patch('/unlike/:PostId',auth(),errorHandling(post_controller.unlikepost))






export default router