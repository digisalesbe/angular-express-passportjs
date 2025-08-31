const express = require('express');
const passport = require('passport');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

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

app.use('/api/auth', authRoutes);

// Allow max 100 requests per IP per 15 minutes
const ExpressJSAppLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.all('/*routing', ExpressJSAppLimiter, (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/dist/browser/index.html'));
});

app.listen(4201, ()=>{
    console.log('listening on port 4201');
});