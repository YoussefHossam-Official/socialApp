// Converted from .js to .ts — automated lightweight conversion
// NOTE: manual type annotations and refactoring recommended.

import {  model,Schema } from "mongoose";


const replySchema = new Schema({
replyBody:{
    type:String,
    required:true
},


replyBy:{
    type:Schema.Types.ObjectId,
    ref:'User'
},
commentId:{
    type:Schema.Types.ObjectId,
    ref:'Comment'
},
replies:[{
    type:Schema.Types.ObjectId,
    ref:'Reply'
}]

},{
    timestamps:true
});


const ReplyModel = model.Reply ||  model('Reply',replySchema);
export default ReplyModel;