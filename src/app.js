const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

// connecting to db
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/tappy-plane')
    .then(db => console.log("DB Connected"))
    .catch(err => console.log(err));

// importing routes
const indexRoutes = require('./routes/index');
const apiScores = require('./api/scores');
const apiTemp = require('./api/temp');

// settings
app.set('port', process.env.PORT || 3000);
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
app.listen(app.get('port'), () => {
    console.log(`Server on port: ${app.get('port')}`)
});
