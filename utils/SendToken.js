const jwt = require('jsonwebtoken');

const sendToken = (user, statusCode, res) => {
  // Generate JWT using method defined on userSchema
  const token = user.getJWTToken();

  // Cookie options
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_EXPIRES_TIME || '7') * 24 * 60 * 60 * 1000 // default 7 days
    ),
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'None' : 'Lax',
  };

  // Set cookie and return response
  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token,
      user: {
        _id: user._id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        department: user.department,
        designation: user.designation,
        status: user.status,
      }
    });
};

module.exports = sendToken;
