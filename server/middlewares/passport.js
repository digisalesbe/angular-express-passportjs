const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const UserModel = require('../models/user');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const pub_key = fs.readFileSync(path.join(__dirname, '..', 'id_rsa_pub.pem'), 'utf-8');

const jwtStrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: pub_key,
    algorithms: ['RS256']
}

const localStrategyOptions = {
    usernameFields: 'username',
    passwordFields: 'password'
}

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
const localLoginStrategy = new LocalStrategy(localStrategyOptions, async (username, password, done)=>{
    //TODO: validation for form inputs
    try{
        let user = await UserModel.findOne({username: username});
        if(!user) return done(null, false, {message: "Username does not exists!"});
        const isValid = await bcrypt.compare(password, user.password);
        if(!isValid) return done(null, false, {message: "Invalid password!"});
        user = user.toObject()
        delete user.password;
        return done(null, user);
    }
    catch(err){
        return done(err);
    }
});

//for register to generate the token
const localSignupStrategy = new LocalStrategy(localStrategyOptions,async (username, password, done)=>{
    //TODO: validation for form inputs
    try{
        let user = await UserModel.findOne({username: username}, {password: 0});
        if(!user){
            const hash = await bcrypt.hash(password, 10);
            let newuser = new UserModel({
                username: username,
                password: hash
            });
            user = await newuser.save();
            return done(null, user);
        }
        else{
            return done(null, false, {message: 'Username already exists!'})
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