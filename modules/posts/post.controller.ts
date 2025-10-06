// Converted from .js to .ts — automated lightweight conversion
// NOTE: manual type annotations and refactoring recommended.

import PosttModel from "../../Db/models/post.model.js";
import userModel from "../../Db/models/user.model.js";
import cloudinary from "../../utils/cloudinary.js";

//add post with image
export const addPostWithimage = async (req,res,next) => {
  const {caption} = req.body;
  const {firstName,_id} = req.user;
 
if (!req.file) {
    
    return next(new Error('please choose pic'))
 


}
      const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{
          folder:`posts/${firstName}`
      })
   
  const newProduct = new PosttModel({caption,Image:secure_url,publicId:public_id,createdBy:_id});
  const savedProd = await newProduct.save();
  if (!savedProd) {
      return next(new Error('fail try again later'))
  }
  const updateuser = await userModel.findByIdAndUpdate(_id,{
    $push:{
        posts:newProduct._id
    }
  })
  if (!updateuser) {
      return next(new Error('fail update user'))

  }
return  res.status(201).json({message:'success',savedProd })
}


// add post with out image
export const addPostNoImage = async (req,res,next) => {
    const {caption} = req.body;
    const {firstName,_id} = req.user;
   

      
      const newPost = new PosttModel({caption,createdBy:_id});
      const savedPost = await newPost.save();
      if (!savedPost) {
          return next(new Error('fail try again later'))
      }
      const updateuser = await userModel.findByIdAndUpdate(_id,{
          $push:{
              posts:newPost._id
          }
        })
        if (!updateuser) {
            return next(new Error('fail update user'))
      
        }
   return  res.status(201).json({message:'success',savedPost })
  
  

    
  }


  // get all posts 
  export const getAllPosts = async (req,res,next) => {

    const posts = await PosttModel.find({}).populate([{
        path:'createdBy',
        select:'-_id firstName lastName email profile_pic'
    },{
      path:'comments',
      populate:[{
        path:'commBy',
        select:'-_id firstName lastName email profile_pic'
      },{
        path:'replies',
      }]
    }]);
    if (!posts.length) {
        res.status(200).json({message:'no posts yet'})
    }
    res.status(200).json({message:'success' , data:posts})

  }

  // get all posts specific  user  profile
export  const profilPosts = async (req,res,next) => {
  const {_id} =  req.user
       
    const posts = await PosttModel.find({createdBy:_id}).populate([{
      path:'createdBy',
      select:'-_id firstName lastName email profile_pic'
  },{
    path:'comments',
    populate:[{
      path:'commBy',
      select:'-_id firstName lastName email profile_pic'
    },{
      path:'replies',
    }]
  }]);

    if (!posts.length) {
        res.status(200).json({message:'no posts yet'})
    }
    res.status(200).json({message:'success' , data:posts})     


}

// delete post
export const deletePost = async (req,res,next) => {
  const {postid}= req.params;
  const {_id} = req.user;
  const post = await PosttModel.findOne({createdBy:_id}) 
  if (!post) {
    next (new Error('tou can not delete this post',{cause:400}))
    
  }
  const deletedPost = await PosttModel.findByIdAndDelete(postid);
  if (!deletedPost) {
    next (new Error('invalid post id',{cause:400}))
  }
  return res.status(200).json({message:'delete success'})
}

// give like to post 
export const likePost = async (req,res,next) => {
  const {_id}= req.user;
  const {PostId} = req.params;


  const post = await PosttModel.findByIdAndUpdate(PostId,{
    $addToSet:{
              likes:_id
          },
          $pull:{
                    unlikes:_id
                }
  },{new:true});
  console.log(post)
    if (!post) {
  return  next(new Error(`invalid post id`,{cause:400}))
  

}


return res.status(200).json({message:"like done"})

}


// unlike post
export const unlikepost = async(req,res,next) => {
  const {_id}= req.user;
  const {postId} = req.params;
  const post = await PosttModel.findOneAndUpdate({_id:postId},{
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





  





