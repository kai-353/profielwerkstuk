const express = require("express");
const router = express.Router();
const passport = require("passport");
var db = require('../config/conn')();

const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

router.get('/login', forwardAuthenticated, (req, res) => res.render('login', { user: req.user}));

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
});

router.get('/profile/:id', (req, res) => {
  var id = req.params.id;
  db.query(`SELECT username, email, created_at FROM users WHERE id = '${id}'`, (err, result) => {
    console.log(result[0]);
    res.send(result[0]);
  });
});

router.get('/register', forwardAuthenticated, (req, res) => res.render('register', { user: req.user}));

router.post('/register', (req, res) => {
  const { username, email, password, password2 } = req.body;
  let errors = [];

  if (!username || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (email.length > 90) {
    errors.push({ msg: 'email too long' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      username,
      email,
      password,
      password2
    });
  } else {
    db.query(`SELECT email FROM users WHERE email = '${email}'`, (err, result) => {
      if (result[0] != undefined) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          username,
          email,
          password,
          password2
        });
      } else {
        const newUser = {
          username,
          email,
          password
        }
        db.query("INSERT INTO users SET ?", newUser, (err, result) => {
          if (err) throw err;
          req.flash(
            'success_msg',
            'You are now registered and can log in'
          );
          res.redirect('/users/login');
        });
      }
    });
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  req.user = undefined;
  res.redirect('/users/login');
});

module.exports = router;