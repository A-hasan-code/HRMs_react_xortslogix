//const crypto = require('crypto');
const {createUserSchema, updateUserSchema} = require('../Validations/userValidation');
const SendToken =require('../utils/SendToken');
const User = require('../models/user.models'); 
const catchAsync=require('../middleware/catchAsyncError')
const ErrorHandler = require('../utils/errorHandler');
//const sendEmail = require('../utils/SendToken');
//const bcrypt = require('bcryptjs');

//register user
exports.registerUser = catchAsync(async (req, res, next) => {
  const { error } = createUserSchema.validate(req.body);
  if (error) return next(new ErrorHandler(error.details[0].message, 400));

  const existing = await User.findOne({ email: req.body.email });
  if (existing) return next(new ErrorHandler('Email already in use', 409));
 const profilePic = req.file ? `/uploads/${req.file.filename}` : '';
  const user = await User.create({
    ...req.body,
    profile_picture: profilePic,
    created_by: req.user?._id || null,
  });

  SendToken(user, 201, res);
});

//login user
exports.loginUser =catchAsync(async (req, res, next) => {
    try{
const {email,password} =req.body;
if (!email || !password){
    return next(new ErrorHandler('Please provide email and password', 400));
}
const user  =await User.find({email}).select('+password');
if (!user || !(await user.comparePassword(password)) ){return next(new ErrorHandler('Invalid email or password', 401))}
SendToken(user, 200, res);  
    }catch(error){
        return next(new ErrorHandler('Invalid email or password', 401));
    }
})