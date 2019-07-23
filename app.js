const express = require('express')
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const authRoutes = require('./routes/auth-routes')
const app = express()
const {database, session, port} = require('./config/config')
const passport = require('passport')

// Setup view engine
app.set('view engine', 'ejs')

// Set static folder
app.use(express.static('public'))
app.use("/auth", express.static('public'))

// connect to database
mongoose.connect(database.dbURI, { useNewUrlParser: true }, ()=>{
    console.log('connected  to DB')
})

// configure cookieSession middleware
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [session.cookieKey]
}))

// configure passport.js middleware
require('./config/passportFacebookConf')
app.use(passport.initialize())
app.use(passport.session())

// http://localhost:3000/
app.get('/', (req,res)=>{
    res.render('home', {title: "home page", user: req.user})
})

app.get('/dashboard', require('connect-ensure-login').ensureLoggedIn('/auth/signin') , (req,res)=>{
    res.render('dashboard', {title: "dashboard page", user: req.user})
})

// Setup routes
app.use('/auth', authRoutes)

// listen to server
app.listen(port, ()=> {console.log(`server running on http://localhost:${port}`)})
