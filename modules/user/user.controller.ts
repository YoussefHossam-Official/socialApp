// Converted from .js to .ts — automated lightweight conversion
// NOTE: manual type annotations and refactoring recommended.


import { sendEmail } from "../../services/sendEmail.js";
import cloudinary from "../../utils/cloudinary.js";


import userModel from "../../Db/models/user.model.js";
import { compareFunction, hashFunction } from './../../utils/hashFunction.js';
import { tokenDecode, tokenGenerator } from "../../utils/tokenfunction.js";



// sign up
export const signup = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

          // check email existing
  const match = await userModel.find({ email });
  if (!match.length) {
    const hashedpassword = hashFunction({ payload: password });
    if (hashedpassword) {
      const newUser = new userModel({
        firstName,
        lastName,
        email,
        password: hashedpassword,
      });
      const token = tokenGenerator({ payload: { id: newUser._id } });
  
      const confirmationLink = `${req.protocol}://${req.headers.host}/exam/api/v1/user/confirmemail/${token}`;
      const sentEmail = await sendEmail({
        to: newUser.email,
        message: `<a href=${confirmationLink}>click to confirm </a>`,
        subject: "Confirm your email",
      });
      if (sentEmail) {
        await newUser.save();
        return res
          .status(201)
          .json({
            message: " sign up success , please confirm from your email",
          });
      } else {
        res.next(new Error("unknownerror please try again later"));
      }
    } else {
      next(new Error("Hash password fail", { cause: 400 }));
    }
  } else {
    next(new Error("email already exists", { cause: 409 }));
  }
};

// confirm email
export const confirmemail = async (req, res, next) => {
  const { token } = req.params;
  const decode = tokenDecode({ payload: token});
  if (decode?.id) {
    const user = await userModel.findOneAndUpdate(
      { _id: decode.id, isConfirmed: false },
      { isConfirmed: true }
    );
    if (user) {
      return res.status(200).json({ message: "confirmation  success" });
    }
    return res.status(200).json({ message: "user already confirmed " });
  } else {
    res.next(new Error("invalid token ", { cause: 400 }));
  }
};

// login
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const emailexists = await userModel.findOne({ email });

  if (!emailexists) {
    return next(new Error("invalid email or password"));
  }

  const match = compareFunction({
    payload: password,
    Referenceddata: emailexists.password,
  });
  if (match) {
    if (emailexists.isConfirmed) {
      const token = tokenGenerator({
        payload: {
          id: emailexists._id,
          firstName: emailexists.firstName,
          email: emailexists.email,
          regDate: emailexists.createdAt

        },
      });
      if (token) {
        await userModel.updateOne({_id:emailexists._id},{isLoggedIn:true})
        res.status(200).json({ message: "login success", token });
      } else {
        next(new Error("token generation failed"));
      }
    } else {
   

       res.status(200).json({message:'please confirm activation from your email'})
    }
  } else {
    next(new Error("invalid email or password"));
  }
};


// forget password
export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  const emailexists = await userModel.findOne({ email });
  if (!emailexists) {
    return next(new Error("invalid email ", { cause: 400 }));
  } else {
    let forgetCode = Math.floor(1000 + Math.random() * 9000);
    const sentEmail = await sendEmail({
      to: emailexists.email,
      message: `<p >your code to reset password ${forgetCode} please ignor if u don't forget password </p>`,
      subject: "forget password code  ",
    });
    if (sentEmail) {
      const updateuser = await userModel.findByIdAndUpdate(
        emailexists._id,
        { forgetCode: forgetCode },
        { new: true }
      );
      if (updateuser) {
        res
          .status(200)
          .json({
            message: " success check your email for reset password code "
          
          });
      } else {
        next(new Error("can't send reset code please try again later "));
      }
    } else {
      res.next(new Error("unknown error please try again later"));
    }
  }
};

// reset password 
export const resetPassword = async (req,res,next) => {
  const {forgetCode,newpassword} = req.body ;
  const {userid}= req.params;
  const user = await userModel.findOne({_id:userid,forgetCode}).select('-password');
 
  if(!user){
    next(new Error("invalid user id or code ", {cause:400}));

  }else{
    const hashedpassword = hashFunction({ payload: newpassword });
    if (hashedpassword) {
      const updateuser = await userModel.findByIdAndUpdate(
        userid,
        { password: hashedpassword ,forgetCode: 0 }, // reset code to 0 again to invalid it after one try 
       {new:true}
      );
      if (updateuser) {

        res
        .status(200)
        .json({
            message: "success reset password try login  ",
            updateuser
          
          });
      } else {
        next(new Error("reset password fail"));
      }
    } else {
      next(new Error("unknown error please try again later"));
    }
  }


}



// changepassword
export const changePassword = async (req,res,next) => { 
  const {oldpassword,newpassword} = req.body ;
  const user = req.user;
  if (oldpassword == newpassword ) {
  return  next(new Error('same password '))
    
  }
  
  const matchPassword = compareFunction({
    payload: oldpassword,
    Referenceddata: user.password,
  });
  if (!matchPassword) {
  return  next(new Error('wrong old password'))
  }
  const hashNewPass = hashFunction({payload:newpassword});
  if (!hashNewPass) {
  return  next (new Error('fail hash new password'))
  }

  const changePassword = await userModel.findByIdAndUpdate(user._id,{password:hashNewPass},{new:true});
  if (changePassword) {
    res.status(200).json({message: 'password changed '})
  }else{
    next (new Error('change password failed try again later'))
  }


}

// upload user profile on  cloudinary 
export const profilePicture = async (req, res, next) => {
  const {firstName,_id}= req.user;

  if (!req.file) {
    return next(new Error('please select picture',{cause:400}))
  }
  const image = await cloudinary.uploader.upload(req.file.path,{
    folder:`images/${firstName}/profile`
  })
  const user = await userModel.findByIdAndUpdate(_id,{
    profile_pic: image.secure_url,
    profilePicPublicId:image.public_id
  })
  if (!user) {
   return  next(new Error('please try to login ', {cause:400}))
  }
  if (user.profilePicPublicId) {
    await cloudinary,uploader.destroy(user.profilePicPublicId)
 return res.status(201).json({message:'successfully updated'})

  }
 return res.status(201).json({message:'successfully uploaded' })

}




// soft delete 
export const softDelete = async (req,res,next) => {
  const user= req.user;
  const deleteduUser = await userModel.findOneAndUpdate({_id:user._id,isConfirmed:true},
    { isConfirmed: false })
 
  if (deleteduUser) {
    res
  .status(200).json({message:'soft delete success and user deactivated'})
  }else{
    next(new Error("user already not active"));
  }
}

// delete user 
export const deleteUser = async (req,res,next) => {
  const user= req.user;
  const deleteduUser = await userModel.findByIdAndDelete({_id:user._id})
 
  if (deleteduUser) {
    res
 .status(200).json({message:'delete success'})
  }else{
    next(new Error("delete fail "));
  }
}

// logout
export const logout = async (req,res,next) => {
  const user= req.user;
  const updateuser = await userModel.findByIdAndUpdate(
    user._id,
    { isLoggedIn: false },
    { new: true }
  );
  if (updateuser) {
    res
.status(200).json({message:'logout success'})
  }else{
    next(new Error("logout fail"));
  }
}

