const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();

// local variables
require('dotenv').config({path: 'variables.env'})

// connecting to db
mongoose.connect(process.env.DB_URL || 'mongodb://localhost/tappy-plane')
    .then(db => console.log("DB Connected"))
    .catch(err => console.log(err));

// importing routes
const indexRoutes = require('./routes/index');
const apiScores = require('./api/scores');
const apiTemp = require('./api/temp');

// settings
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

// routes
app.use('/', indexRoutes);
app.use('/api/', apiScores);
app.use('/api/', apiTemp);

// starting server
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000; 

app.listen(port, host, () => {
    console.log(`Server on port: ${port}`)
});
