const express = require('express');
const router = express.Router();
const { registerUser,loginUser } = require('../controllers/user.controller');
const upload =require('../utils/Upload')
router.post('/register',upload.single('profile_picture'),registerUser);
router.post('/login',loginUser);
module.exports = router; 
