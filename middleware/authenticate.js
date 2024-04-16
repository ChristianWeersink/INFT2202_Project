const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/userModel');

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        console.log ('look for user');
        if (!user) {
            console.log('user not found');
            return done(null, false, { message: 'User not found' });
        }
        if (!(await user.comparePassword(password))) {
            console.log('password not correct');
            return done(null, false, { message: 'Incorrect email or password' });
        }
        console.log('user found and password correct');
        return done(null, user);
    } catch (error) {
        console.log(error);
        return done(error);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;
