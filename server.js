const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// DB Connection
 const connectDB = require('./config/db');
 connectDB();

// Middleware setup
 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
 //app.options('*', cors());

// Static file serving (e.g., for uploaded files or frontend assets)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.static('public'));

// Status route to confirm server is up
app.get('/', (req, res) => {
    res.json({
        status: "Server is running",
        environment: process.env.NODE_ENV || "development"
    });
});
// app.use((err, req, res, next) => {
//   res.status(err.statusCode || 500).json({
//     success: false,
//     message: err.message || 'Internal Server Error',
//   });
// });

// Import routes
const userRoutes = require('./routes/user.routes');

app.use('/api/v1', userRoutes);

Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT} `);
});
