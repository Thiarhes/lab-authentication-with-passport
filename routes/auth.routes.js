const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
// const passport = require('passport');
const ensureLogin = require('connect-ensure-login');

router.get('/signup', (req, res) => {
  res.render('auth/signup')
});

router.post('/signup', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.render('auth/signup', { errorMessage: 'Indicate username and password' });
      return;
    }
    let user = await User.findOne({ username });
    if (user !== null) {
      res.render('auth/signup', { errorMessage: 'The username already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(bcryptSalt);
    const hashPass = await bcrypt.hash(password, salt);

    let newUser = await new User({
      username,
      password: hashPass,
    });

    await newUser.save();
    res.redirect('/');

  } catch (error) {
    console.log(error)
  }
})

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

module.exports = router;
