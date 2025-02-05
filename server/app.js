const express = require('express');
const passport = require('passport');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use(express.static(path.join(__dirname, 'public/dist/browser')));

// Connect to chosen database in .env file
require('./db/database');

require('./middlewares/passport')(passport);
app.use(passport.initialize());

app.use('/auth', authRoutes);

app.use('*', (req, res)=>{
    res.sendFile(path.resolve(__dirname, 'public/dist/browser/index.html'));
});

app.listen(4201, ()=>{
    console.log('listening on port 4201');
});