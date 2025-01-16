import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { apiResponse } from "../utils/apiResponse.js";
import crypto from "crypto"
import { sendEmail } from "../utils/sendEmail.js";

// Register User functionality
const registerUser = asyncHandler(async(req,res)=>{
    const {username,email,password} = req.body;

    if([username,email,password].some((field)=>field.trim()===""))
        {
            throw new apiError(400,"All field are required")
        }
   

    const existingUser = await User.findOne({email});
    if(existingUser) throw new apiError(409,"User already exist")
    const user = new User({username,email,password});
    await user.save();

    res.redirect("/");
    // return res
    //         .status(201)
    //         .json(
    //             new apiResponse(200,user,"user created successfully")
    //         )
})

const loginUser = asyncHandler(async(req,res)=>{
    const {username, password} = req.body
    if([username,password].some((field)=>field.trim()===""))
        {
            throw new apiError(400,"All field are required")
        }
            const user = await User.findOne({username});
            if(!user) throw new apiError(401,"Invalid username or password");
            const isValidPassword = await user.isPasswordCorrect(password);
            if(!isValidPassword) throw new apiError(401,"Invalid username or password");

            res.redirect("/");
            // return res
            // .status(200)
            // .json(
            //     new apiResponse(200,"User logged successful")
            //     )
})

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user =await User.findOne({email})

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
  
    // Generate a secure reset token
    const resettoken = crypto.randomBytes(32).toString('hex');
    const resetTokenexpiry = Date.now() + 3600000; // Token valid for 1 hour
  
    user.resetToken = resettoken;
    user.resetTokenExpiry = resetTokenexpiry;  
    
    const resetLink = `http://localhost:3000/api/v1/users/reset-password/${resettoken}`;
  
    const emailResult = await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      text: `Here is your password reset link: ${resetLink} and resetToken: ${resettoken}`,
    });
  
    if (!emailResult.success) {
      return res.status(500).send({ message: 'Failed to send email', error: emailResult.error });
    }
    await user.save()
    res.send({ message: 'Password reset email sent' });
  });

const resetPassword = asyncHandler(async(req,res)=>{
    const {resetToken}= req.params;
    const {newPassword} = req.body
    if([resetToken,newPassword].some((field)=>field.trim()===""))
        {
            throw new apiError(400,"All field are required")
        }
        const user = await User.findOne({resetToken});
        if(!user) throw new apiError(404,"Invalid reset token");
        user.password = newPassword;
        await user.save();
        return res
        .status(200)
        .json(
            new apiResponse(200,"Password reset successful")
            )
})

export {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
}