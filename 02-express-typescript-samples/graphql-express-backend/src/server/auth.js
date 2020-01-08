const express = require('express');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const FacebookStrategy = require('passport-facebook');
const GoogleStrategy = require('passport-google-oauth20');

const router = express.Router();


// Auth0
// This will configure Passport to use Auth0
const strategy = new Auth0Strategy({
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.DOMAIN_URL + 'callback'
}, (accessToken, refreshToken, extraParams, profile, done) => {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    profile.extraParams = extraParams;
    return done(null, profile);
});

passport.use(strategy);

// you can use this section to keep a smaller payload
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

router.get('/login', passport.authenticate('auth0', {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    redirectUri: process.env.DOMAIN_URL + 'callback',
    responseType: 'id_token',
    scope: 'openid profile'
}), (req, res) => {
    // console.log();
    // console.log();
    // console.log();
    // console.log('fgdtdfuyfuutti', req);
    res.redirect('/');
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get(
    '/callback',
    passport.authenticate('auth0', {
        failureRedirect: '/failure'
    }),
    (req, res) => {
        // console.log('111111', req.user);
        res.cookie('crypto_token', req.user.extraParams.id_token, {
            maxAge: 900000,
            httpOnly: true
        });
        res.redirect(req.session.returnTo || '/graphql');
    }
);

router.get('/failure', (req, res) => {
    const error = req.flash('error');
    const error_description = req.flash('error_description');
    req.logout();
    res.render('failure', {
        error: error[0],
        error_description: error_description[0],
    });
});

// Facebook

const transformFacebookProfile = profile => ({
    firstName: profile.first_name,
    lastName: profile.last_name,
    avatar: profile.picture.data.url,
    email: profile.email,
    gender: profile.gender
});

// Register Facebook Passport strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.DOMAIN_URL + 'auth/facebook/callback',
    profileFields: ['name', 'displayName', 'picture', 'emails'],
}, async(accessToken, refreshToken, profile, done) => done(null, transformFacebookProfile(profile._json))));

router.get('/facebook', passport.authorize('facebook', {
    scope: ['email']
}));

router.get(
    '/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect: '/auth/facebook'
    }),
    (req, res) => {
        res.redirect('OAuthLogin://login?user=' + JSON.stringify(req.user));
    }
);

// Google+

// Transform Google profile into user object
const transformGoogleProfile = profile => ({
    name: profile.displayName,
    avatar: profile.image.url,
    email: profile.email
});

// Register Google Passport strategy
passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.DOMAIN_URL + 'auth/google/callback'
    },
    async(accessToken, refreshToken, profile, done) => {
        profile._json.email = profile.emails[0].value;
        profile._json.gender = profile.gender;
        done(null, transformGoogleProfile(profile._json));
    }
));

router.get('/google', (req, res, next) => {
    if (req.query.return) {
        req.session.oauth2return = req.query.return;
    }
    next();
}, passport.authenticate('google', {
    scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
    ]
}));

router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/auth/failure'
    }),
    (req, res) => {
        console.log('req', req.user);
        res.redirect('OAuthLogin://login?user=' + JSON.stringify(req.user));
    }
);


module.exports = {
    router,
    passport
};