const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const escapeHtml = require('escape-html');

const UserModel = require('../models/user');
const pub_key = fs.readFileSync(path.join(__dirname, '..', 'id_rsa_pub.pem'), 'utf-8');

const jwtStrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: pub_key,
    algorithms: ['RS256']
}

const localStrategyOptions = {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}

// Validation of the form input fields with extra checks
const validateInput = (username, password, name, isSignup = true) => {
    const errors = [];

    if (isSignup && !name) {
        errors.push('Name is required');
    }

    if (!username) {
        errors.push('Username is required');
    } else {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        const usernameToTest = String(username).trim(); // Ensure it's a string and remove spaces
        if (!usernameRegex.test(usernameToTest)) {
            errors.push('Username must be 3-20 characters long and can only contain letters, numbers, and underscores');
        }
    }

    if (!password) {
        errors.push('Password is required');
    } else {
        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            errors.push('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
        }
    }

    return errors.length > 0 ? errors : null;
};

//for parsing the jwt
const jwtStrategy = new JwtStrategy(jwtStrategyOptions, async (jwt_payload, done)=>{
    console.log(jwt_payload)
    try{
        let user = await UserModel.findById(jwt_payload.sub, {username: 1});
        if(!user) return done(null, false, {message: 'Invalid Token'});
        
        return done(null, user);
    }
    catch(err){
        return done(err);
    }
});

//for login to generate the token
const localLoginStrategy = new LocalStrategy(localStrategyOptions, async (req,username, password, done)=>{
    try{
        // Basic input sanitization
        username = escapeHtml( username.trim().toLowerCase() );
        password = escapeHtml( password );

        let user = await UserModel.findOne({username: username});
        if(!user) return done(null, false, {message: "Username or password incorrect !"});
        
        const isValid = await bcrypt.compare(password, user.password);
        if(!isValid) return done(null, false, {message: "Username or password incorrect !"});
        
        user = user.toObject()
        delete user.password;
        
        return done(null, user);
    }
    catch(err){
        return done(err);
    }
});

// For register to generate the token
const localSignupStrategy = new LocalStrategy(localStrategyOptions, async (req, username, password, done)=>{
    let name;
    try {
        ({ name } = req.body);  // Extract name from req.body

        if (!name) {
            return done(null, false, { message: 'Name is required' });
        }

        // Validate input fields of the form
        const errors = validateInput(username, password, name);
        if (errors) {
            return done(null, false, { message: errors.join(', ') });
        }

        // Basic input sanitization
        username = escapeHtml( username.trim().toLowerCase() );
        password = escapeHtml( password );
        name = escapeHtml( name.trim() );

        let user = await UserModel.findOne({username: username}, {password: 0});
        // User does not exist
        if(!user){
            const hash = await bcrypt.hash(password, 10);
            let newuser = new UserModel({
                name: name,
                username: username,
                password: hash,
                status: 0
            });
            user = await newuser.save();
            return done(null, user);
        }
        else{
            return done(null, false, {message: 'Username already exists !'})
        }        
    }
    catch(err){
        return done(err);
    }
});

module.exports = (passport) => {
    passport.use('jwt', jwtStrategy);
    passport.use('localLogin', localLoginStrategy);
    passport.use('localSignup', localSignupStrategy);
}