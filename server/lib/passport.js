var passport = require('passport'),
    passportYandex = require('passport-yandex').Strategy,
    db = require('../lib/db');

passportYandex.prototype.authorizationParams = function() {
    return {
        state: process.env.SUDO_USER
    };
};

passport.use(new PassportYandex({
        clientID: '--- Client ID ---',
        clientSecret: '--- Client secret ---',
        callbackURL: 'http://localhost:3000/login/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        console.log(done(err, profile));

        //db.upsertUser(profile.id, profile, function(err, data) {
        //    done(err, profile);
        //});
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    db.getUser(id, function(err, data) {
        if (data && data.profile) {
            done(null, data.profile)
        } else {
            done(err);
        }
    });
});

module.exports = passport;