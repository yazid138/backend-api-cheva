require('dotenv').config();
const cors = require('cors');
const express = require('express');
const path = require('path');
const fs = require("fs");
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const logger = require('morgan');

const app = express();

app.use(cors())
app.use(fileUpload());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const pathRoutes = './routes/';
fs.readdirSync(pathRoutes).forEach((file) => {
    if (path.extname(file) === '.js') {
        require(pathRoutes + file)(app);
    }
});

app.use((req, res) => {
    res.status(404).json({
        status: 404,
        message: 'page not Found',
    });
});

module.exports = app;
