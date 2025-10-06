// Converted from .js to .ts — automated lightweight conversion
// NOTE: manual type annotations and refactoring recommended.


import {  model,Schema } from "mongoose";


const postSchema = new Schema({

caption:String,
Image:{
    type:String,

},
publicId:{
    type:String,

},
likes:[{
    type:Schema.Types.ObjectId,
    ref:'User'
}],
unlikes:[{
    type:Schema.Types.ObjectId,
    ref:'User'
}],

isDeleted:{
    type:Boolean,
    default:false
}
,
createdBy:{
    type:Schema.Types.ObjectId,
    ref:'User'
},
comments:[{
    type:Schema.Types.ObjectId,
    ref:'Comment'
}]

},{
    timestamps:true
});


const PosttModel = model.Post ||  model('Post',postSchema);
export default PosttModel;