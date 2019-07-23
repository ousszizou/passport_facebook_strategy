const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/user-model')
const { facebook } = require('./config')

passport.use(new FacebookStrategy({
    clientID: facebook.clientID,
    clientSecret: facebook.clientSecret,
    callbackURL: "/auth/facebook/cb"
},(accessToken, refreshToken, profile, done) =>{
  // check first if user already exists in our DB.
    User.findOne({facebookId: profile.id}).then((currentUser) =>{
        if (currentUser) {
            done(null, currentUser)
        } else {
            const user = new User({
                username: profile._json.name,
                facebookId: profile.id
            })
            user.save().then(() => console.log("user saved to DB."))
            done(null, user)
        }
    })
}))

passport.serializeUser((user, done) =>{
    done(null, user.id)
})

passport.deserializeUser((id, done) =>{
    User.findById(id).then((user) =>{
        done(null, user)
    })
})