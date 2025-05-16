const express = require('express');
const router = express.Router();
const { registerUser,loginUser,logoutUser,getMyProfile,updateProfile } = require('../controllers/user.controller');
const upload =require('../utils/Upload')
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/jwtToken');
router.post('/register',upload.single('profile_picture'),registerUser);
router.post('/login',loginUser);
router.get('/logout',logoutUser);
router.get('/me', isAuthenticatedUser, getMyProfile);
router.patch('/updatSe', isAuthenticatedUser, upload.single('profile_picture'), updateProfile)
module.exports = router; 
