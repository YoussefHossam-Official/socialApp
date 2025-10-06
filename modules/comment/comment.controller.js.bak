
import CommentModel from "../../Db/models/comment.model.js";
import PosttModel from "../../Db/models/post.model.js";
import ReplyModel from "../../Db/models/reply.model.js";






// add comment 
export const addComment = async (req,res,next) =>{
    const {commentBody,postId} = req.body;
    const {_id} = req.user;
    const product = await PosttModel.findById({_id: postId});
    if (!product) {
        return next(new Error(`invalid product id`,{cause:400}))
    }
    const newComment = new CommentModel({commentBody,commBy:_id,postId});
    const savedCommment = await newComment.save();
    if (!savedCommment ) {
        return next(new Error(`fail try again later`))   
    }

    const update = await PosttModel.updateOne({_id:postId},{
        $push:{
            comments:newComment._id
        }
    })
    if (!update.modifiedCount) {
        return next(new Error(`fail`))
        
    }

    res.status(201).json({message:'success',savedCommment})

}

// delete comment
export const deleteComment =async (req,res,next) => {
  const {commentId} = req.params;
  const {_id} = req.user;

  const deletedComment = await CommentModel.findOneAndDelete({_id:commentId,commBy:_id});
  if (!deletedComment) {
    return next(new Error(`delete fail or ivalid id`,{cause:400}))
  }

  const check = await PosttModel.updateOne({_id:deletedComment.postId},{
    $pull:{
        comments:deletedComment._id
    }
  });
  if (!check.modifiedCount) {
    return next(new Error(`pulling fail`,{cause:400}))
  }
  res.status(200).json({message:' delete done'})
}

// post owner delete comment 
export const deleteCommentfromPostOwner =async (req,res,next) => {
  const {commentId} = req.params;
  const {_id} = req.user;

  const comment = await CommentModel.findById(commentId);
  if (!comment) {
    return next(new Error(`ivalid comment id`,{cause:400}))
    
  }
  const post = await PosttModel.findById(comment.postId);
  if (!post) {
    return next(new Error(`ivalid post id`,{cause:400}))
    
  }
      // post owner id
  const postOwner = post.createdBy;

 if (postOwner.toString() === _id.toString()) {
  const deletedComment = await CommentModel.findOneAndDelete({_id:commentId});
  if (!deletedComment) {
    return next(new Error(` ivalid id`,{cause:400}))
 
  }
  const check = await PosttModel.updateOne({_id:deletedComment.postId},{
    $pull:{
        comments:deletedComment._id
    }
  });
  if (!check.modifiedCount) {
    return next(new Error(`pulling fail`,{cause:400}))
  }
  res.status(200).json({message:' delete done'})




 }else{
  return next(new Error(`you can't delete this comment`,{cause:400}))
 

 }

  

  
}

// get all comments of specific post 
export const getAllCommentOnPost = async (req,res,next) => {
  const {postId} = req.params

  const comments = await CommentModel.find({postId}).populate([{
    path:'commBy',
    select:'-_id firstName lastName email profile_pic'
  }])
  if (!comments) {
    return next(new Error(`invalid id or no posts`,{cause:400}))
  }
  res.status(200).json({message:' success',comments})

}



// add reply 
export const addReply = async (req,res,next)=> {
  const {commentId,replyBody} = req.body;
  const {_id} = req.user;
  const comment = await CommentModel.findById(commentId);
  if (!comment) {
    return next(new Error('invalid comment id', {cause:400}))
  }
  const newReply = new ReplyModel({replyBody,commentId,replyBy:_id});
  const savedReply =await newReply.save();


  const check = await CommentModel.updateOne({_id:commentId},{
    $push:{
      replies:savedReply._id
    }
  })
  if (!check.modifiedCount) {
    return next(new Error('pushing fail'))  
  }

  res.status(200).json({message:"done",newReply})
}



// add reply on reply 
export const addreplyonreply =async (req,res,next) => {
    const {replyId,replyBody}= req.body;
    const {_id}= req.user;
    const reply = await ReplyModel.findById(replyId);
    if (!reply) {
    return next(new Error('invalid reply id', {cause:400})) 
    }
    const newreply = new ReplyModel({replyBody,commentId:replyId,replyBy:_id});
    const savedReply =await newreply.save();
    const update = await ReplyModel.updateOne({_id:replyId},{
      $push:{
        replies:savedReply._id
      }
    })
    if (!update.modifiedCount) {
    return next(new Error('pushing fail'))  
    }
    res.status(200).json({message:"done",savedReply})

}




// delete reply
export const deleteReply = async (req,res,next) => {
      const {_id} = req.user;
      const {replyid} = req.params ;

      const deletedreply = await ReplyModel.findOneAndDelete({_id:replyid,replyBy:_id});
      if (!deletedreply) {
    return next(new Error('fail or invalid reply id', {cause:400}))        
      }
      res.status(200).json({message:"deleted done "})
}


// give like to comment 
export const likecomment = async (req,res,next) => {
  const {_id}= req.user;
  const {commId} = req.params;


  const comment = await CommentModel.findByIdAndUpdate(commId,{
    $addToSet:{
              likes:_id
          },
          $pull:{
                    unlikes:_id
                }
  },{new:true});

    if (!comment) {
  return  next(new Error(`invalid comment id`,{cause:400}))
}
return res.status(200).json({message:"like done"})
}


// unlike comment
export const unlikecomment = async(req,res,next) => {
  const {_id}= req.user;
  const {commId} = req.params;
  const post = await CommentModel.findByIdAndUpdate(commId,{
    $addToSet:{
       unlikes:_id
    },
    $pull:{
        likes:_id
    }
  },{new:true})
  if (!post) {
    next(new Error(`fail`,{cause:400}))
}

res.status(200).json({message:"done",post})
}



