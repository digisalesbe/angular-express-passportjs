const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const rateLimit = require('express-rate-limit');
const sendHtmlEmail = require('../emails/sendMail');
const User = require('../models/user');

const priv_key = fs.readFileSync(path.join(__dirname, '..', 'id_rsa_priv.pem'));

// Function rate limiting for customLoginHandler and customSignupHandler
const rateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Limit each IP to 5 requests per windowMs
  message: { message: 'Too many attempts from this IP address, please try again later.' },
});

// Check authentication when revisiting website
const handleGetUser = (req, res) => {
  res.json({
    username: req.user.username,
    token: req.user.token,
  });
};

router.get('/', passport.authenticate('jwt', { session: false }), handleGetUser);

// Handling the routing of login : log in and verify the given information
const customLoginHandler = (req, res, next) => {
  passport.authenticate('localLogin', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(401).send(info || { message: 'Login failed' });
    }

    req.login(user, { session: false }, (err) => {
      if (err) return next(err);

      const token = jwt.sign(
        {
          sub: user._id,
          name: user.name,
          status: user.status,
        },
        priv_key,
        {
          expiresIn: '1d',
          algorithm: 'RS256',
        }
      );

      return res.json({ username: user.username, token });
    });
  })(req, res, next);
};

router.post('/login', rateLimiter, customLoginHandler);

// Handling the routing of signup : check if user exists already and verify the given information
const customSignupHandler = (req, res, next) => {
  passport.authenticate('localSignup', { session: false }, async (err, user, info) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (!user) {
      if (info && info.redirect) {
        return res.status(409).json({
          message: 'User already exists',
          redirect: true,
          url: info.redirect,
        });
      } else {
        return res.status(401).json({ message: info?.message || 'Authentication failed' });
      }
    }

    try {
      // Generate confirmation token
      const token = jwt.sign(
        { userId: user._id },
        priv_key,
        {
            expiresIn: '1d',
            algorithm: 'RS256',
        }
      );

      const confirmUrl = `${process.env.FRONTEND_URL}/confirm/${token}`;
      
      await sendHtmlEmail(user.username, 'Confirm Your Account', 'confirm', {
        name: user.name,
        confirmUrl
      });

      return res.status(200).json({ message: 'Confirmation email sent.' });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return res.status(500).json({ message: 'Could not send confirmation email.' });
    }
  })(req, res, next);
};

router.post('/signup', rateLimiter, customSignupHandler);

// Handle the routing of logout
const handleLogout = (req, res, next) => {
  req.logout({ session: false }, (err) => {
    if (err) return next(err);
    return res.status(200).send('logged out');
  });
};

router.delete('/logout', handleLogout);

const customConfirmationHandler = async (req, res, next) => {
  const { token } = req.params;

  try {
    const payload = jwt.verify(
        token,
        priv_key,
        {
            algorithm: 'RS256'
        }
    );
    const user = await User.findById(payload.userId);

    if (!user) return res.status(404).send('User not found');
    if (user.status === 1) return res.status(400).send('Already confirmed');

    user.status = 1;
    user.modified = new Date();
    await user.save();

    await sendHtmlEmail(user.username, 'Welcome to Our App!', 'welcome', {
      name: user.name,
      appUrl: process.env.FRONTEND_URL,
    });

    return res.status(200).send('Confirmation received');
    //return res.redirect(`${process.env.FRONTEND_URL}/confirm/`);
  } catch (confirmationError) {
    console.error('Confirmation failed:', confirmationError);
    return res.status(400).send('Invalid or expired token');
  }
};

router.get('/confirm/:token', rateLimiter, customConfirmationHandler);

module.exports = router;