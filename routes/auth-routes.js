const router = require('express').Router()
const passport = require('passport')

// auth login
router.get('/signin', (req,res)=>{
    res.render('login', {title: "login page", user: req.user})
})

// auth logout
router.get('/logout', (req,res) =>{
  req.logout()
  res.redirect('/')
})

// auth with facebook
router.get('/facebook', passport.authenticate('facebook'))

router.get('/facebook/cb', passport.authenticate('facebook', { failureRedirect: '/auth/signin' }), (req,res) => {
  res.redirect('/dashboard')
})

module.exports = router
