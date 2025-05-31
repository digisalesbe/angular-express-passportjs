const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');

const priv_key = fs.readFileSync(path.join(__dirname, '..', 'id_rsa_priv.pem'));

// Function rate limiting for customLoginHandler and customSignupHandler
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 10 requests per windowMs
  message: { message: 'Too many attempts from this IP, please try again later.' },
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
  passport.authenticate('localSignup', { session: false }, (err, user, info) => {
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

    req.login(user, { session: false }, (loginErr) => {
      if (loginErr) return next(loginErr); // Use next() for error propagation

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

router.post('/signup', rateLimiter, customSignupHandler);

// Handle the routing of logout
const handleLogout = (req, res, next) => {
  req.logout({ session: false }, (err) => {
    if (err) return next(err);
    return res.status(200).send('logged out');
  });
};

router.delete('/logout', handleLogout);

module.exports = router;