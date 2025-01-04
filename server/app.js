const express = require('express');
const passport = require('passport');
const cors = require('cors');
const path = require('path');

require('dotenv').config()

const userRoutes = require('./routes/users');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use(express.static(path.join(__dirname, 'public/dist/browser')));

require('./db/mongoose');
require('./middlewares/passport')(passport);
app.use(passport.initialize());

app.use('/users', userRoutes);

app.use('*', (req, res)=>{
    res.sendFile(path.resolve(__dirname, 'public/dist/browser/index.html'));
});

app.listen(3000, ()=>{
    console.log('listening on port 3000');
});