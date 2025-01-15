import { Router } from "express";
import path from "path";
import { forgotPassword, loginUser, registerUser, resetPassword } from "../controllers/user.controller.js";

const router = Router()

router.route('/register').post(registerUser);
router.route('/login').post(loginUser)
router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password/:resetToken').post(resetPassword)


router.get('/register',(req,res)=>{
    res.sendFile(path.resolve('public/register.html'))
})

router.get('/login',(req,res)=>{
    res.sendFile(path.resolve('public/login.html'))
})
export default router