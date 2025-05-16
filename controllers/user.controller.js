//const crypto = require('crypto');
const fs = require('fs');
const {createUserSchema, updateUserSchema} = require('../Validations/userValidation');
const SendToken =require('../utils/SendToken');
const User = require('../models/user.models'); 
const catchAsync=require('../middleware/catchAsyncError')
const ErrorHandler = require('../utils/errorHandler');
//const sendEmail = require('../utils/SendToken');
const bcrypt = require('bcryptjs');
const path = require('path');
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
const user = await User.findOne({ email }).select('+password');
if (!user) {
  console.log("User not found");
  return next(new ErrorHandler('Invalid email or password', 401));
}

const isPasswordMatched = await user.comparePassword(password);
if (!isPasswordMatched) {
  console.log("Password mismatch");
  return next(new ErrorHandler('Invalid email or password', 401));
}

SendToken(user, 200, res);  
    }catch(error){
        return next(new ErrorHandler('Invalid email or password', 401));
    }
})
//logout user
exports.logoutUser = catchAsync(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});
//get current user
exports.getMyProfile = catchAsync(async (req, res, next) => {
    const user =await User.findById(req.user._id).select('-password');
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }
    res.status(200).json({
        success: true,
        user,
    });
})
//update user profile
exports.updateProfile = catchAsync(async (req, res, next) => {
  const { error, value } = updateUserSchema.validate(req.body);
  if (error) return next(new ErrorHandler(error.details[0].message, 400));

  const userId = req.user._id;

  // 🔐 Hash password
  if (value.password) {
    value.password = await bcrypt.hash(value.password, 10);
  }

  // Get existing user
  const existingUser = await User.findById(userId);

  // Handle profile picture update
if (req.file && req.file.filename) {
    const newProfilePath = `/uploads/profile_pictures/${req.file.filename}`;

    // ✅ Delete old image (if not default)
    if (
      existingUser.profile_picture &&
      existingUser.profile_picture !== '' &&
      !existingUser.profile_picture.includes('default')
    ) {
      const cleanRelativePath = existingUser.profile_picture.replace(/^\/+/, '');
const fullOldPath = path.join(__dirname, '../../public', cleanRelativePath);


      console.log('🔍 Checking image:', fullOldPath);

      if (fs.existsSync(fullOldPath)) {
        fs.unlinkSync(fullOldPath);
       
      }
    }

    // ✅ Update DB with new path
    value.profile_picture = newProfilePath;  //A
  }

  value.updated_by = req.user._id;
  value.updated_at = new Date();

  const updatedUser = await User.findByIdAndUpdate(userId, value, {
    new: true,
    runValidators: true,
  }).select('-password');

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: updatedUser,
  });
});