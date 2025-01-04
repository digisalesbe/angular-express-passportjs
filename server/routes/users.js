const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const priv_key = fs.readFileSync(path.join(__dirname, '..', 'id_rsa_priv.pem'));

router.get('/', (req, res)=>{
    passport.authenticate('jwt', {session: false}, (err, user, info)=>{
        if(err || !user){
            return res.status(401).send(info);
        }
        return res.json({username: user.username});
    })(req, res)
})


router.post('/login', (req, res)=>{
    //Note: no need of passport authenticate middleware, instead of fetch the user from db and send the signed user as a token
    passport.authenticate('localLogin', {session: false}, (err, user, info)=>{
        if(err || !user){
            console.log(err);
            return res.status(401).send(info);
        }
        req.login(user, {session: false}, (err)=>{
            if(err) return res.send(err);
            const token = jwt.sign({sub: user._id}, priv_key, { expiresIn: "1d", algorithm: 'RS256' });
            return res.json({username: user.username, token});
        })
    })(req, res);
});

router.post('/signup', (req, res)=>{
    passport.authenticate('localSignup', {session: false}, (err, user, info)=>{
        if(err || !user){
            return res.status(401).send(info);
        }
        req.login(user, {session: false}, (err)=>{
            if(err) return res.send(err);
            const token = jwt.sign({sub: user._id}, priv_key, { expiresIn: "1d", algorithm: 'RS256' });
            return res.json({username: user.username, token});
        })
    })(req, res);
});

router.delete('/logout', (req, res)=>{
    req.logout({session: false}, (err)=>{
        if(err) return res.status(500).send(err);
        return res.status(200).send('loggedout');
    })
});

module.exports = router;

