const multer = require('multer');
const path = require('path');

//destination for the uploaded files
const storage = multer .diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../public/uploads/profile_pictures');
        cb(null, dir);
    },
   filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const userId = req.user ? req.user._id : Date.now(); // fallback if user not in req
    const fileName = `profile_picture-${userId}${ext}`;
    cb(null, fileName);
  }
})

//file filter

const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: File upload only supports the following filetypes - ' + filetypes);
    }
}
const upload = multer({
    storage,
    fileFilter}

)

module.exports = upload;