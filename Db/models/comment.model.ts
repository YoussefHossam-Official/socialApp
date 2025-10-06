// Converted from .js to .ts — automated lightweight conversion
// NOTE: manual type annotations and refactoring recommended.

import {  model,Schema } from "mongoose";


const commentSchema = new Schema({
commentBody:{
    type:String,
    required:true
},


commBy:{
    type:Schema.Types.ObjectId,
    ref:'User'
},
postId:{
    type:Schema.Types.ObjectId,
    ref:'Post'
},
replies:[{
    type:Schema.Types.ObjectId,
    ref:'Reply'
}],
likes:[{
    type:Schema.Types.ObjectId,
    ref:'User'
}],
unlikes:[{
    type:Schema.Types.ObjectId,
    ref:'User'
}],

},{
    timestamps:true
});


const CommentModel = model.Comment ||  model('Comment',commentSchema);
export default CommentModel;