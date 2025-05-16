const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
  phone_number: {
    type: String,
    trim: true,
  },
  department: {
    type: String,
    enum: ['Graphics', 'Business Officer', 'Development', 'GHL'],
    required: true,
  },
  designation: {
    type: String,
    enum: ['Senior', 'Junior', 'Team Lead', 'Head of Department', 'Intern'],
    required: true,
  },
  role: {
    type: String,
    enum: ['employee','admin'],
    default: 'employee',
  },
  profile_picture: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },

  // 🔐 For Password Reset (optional)
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpire: {
    type: Date,
    default: null,
  },

  // 🕓 Audit Fields
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

// 🔄 Auto-update timestamps
userSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

// 🔐 Hash password before save
userSchema.pre('save', async function (next) {
  this.updated_at = new Date();

  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});


// 🔐 Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🔐 Generate JWT Token
userSchema.methods.getJWTToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
      department: this.department,
      designation: this.designation,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_TIME || '7d',
    }
  );
};

module.exports = mongoose.model('User', userSchema);
