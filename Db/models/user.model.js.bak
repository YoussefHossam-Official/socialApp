import {  model,Schema } from "mongoose";


const userSchema = new Schema({
    firstName:String,
    lastName:String,
    email:{
        type:String,
        unique:true,
    },
    password:String,

    profile_pic:{type:String,default:''},
    profilePicPublicId:{type:String,default:''},
    
    isConfirmed:{
        type:Boolean,
        default:false
    },
    isLoggedIn:{
        type:Boolean,
        default:false
    },
    forgetCode:{
        type:Number,
        default:0
    },
    posts:[{
        type:Schema.Types.ObjectId,
        ref:'Post'
    }]
    

},{
    timestamps:true
});



const userModel = model.User ||  model('User',userSchema);
export default userModel;