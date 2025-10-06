import { Router } from "express";
const router = Router();
import * as comment_controller from './comment.controller.js'




import { errorHandling } from "../../utils/errorhandling.js";
import { auth } from "../../middleware/Authintication.js";



router.post('/add',auth(),errorHandling(comment_controller.addComment))
router.delete('/delete/:commentId',auth(),errorHandling(comment_controller.deleteComment))
router.delete('/ownerdelete/:commentId',auth(),errorHandling(comment_controller.deleteCommentfromPostOwner))
router.get('/:postId',auth(),errorHandling(comment_controller.getAllCommentOnPost))
router.post('/addreply', auth(),errorHandling(comment_controller.addReply) )
router.post('/addreplyonreply', auth(),errorHandling(comment_controller.addreplyonreply) )
router.delete('/:replyid',auth(),errorHandling(comment_controller.deleteReply))
router.patch('/like/:commId',auth(),errorHandling(comment_controller.likecomment))
router.patch('unlike/:commId',auth(),errorHandling(comment_controller.unlikecomment))


export default router 