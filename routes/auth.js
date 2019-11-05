const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.post('/signup', (req, res) => {
  // See if email is already in DB
  User.findOne({ email: req.body.email }, (err, user) => {
    if (user) {
      // If so, send error
      res.json({
        type: 'error',
        message: 'email already in db'
      })
    } else {
      // If no user in db, create the user in db
      let user = new User(req.body);
      user.save((err, user) => {
        console.log(err)
        if (err) {
          res.json({
            type: 'error',
            message: 'Database error creating user',
            error: err
          })
        } else {
          // Sign a token
          const token = jwt.sign(user.toObject(), process.env.JWT_SECRET, {
            expiresIn: '1d'
          });
          // Return the token
          res.status(200).json({
            type: 'success',
            user: user.toObject(),
            token
          });
        }
      });
    }
  });
})

router.post('/login', (req, res) => {
  // Find the user in the db
  User.findOne({ email: req.body.email }, (err, user) => {
    // If no user, return an erro
    if (!user) {
      res.json({
        type: 'error',
        message: 'Account not found',
      });
    } else {
      // If user, check authentication
      if (user.authenticated(req.body.password)) {
        // if authenticated, sign a token
        const token = jwt.sign(user.toObject(), process.env.JWT_SECRET, {
          expiresIn: '1d'
        });
        // return the token
        res.status(200).json({
          type: 'success',
          user: user.toObject(),
          token
        })
      } else {
        // Authentication failed
        res.json({
          type: 'error',
          message: 'Authentication failed'
        })
      }
    }
  })
})

router.post('/me/from/token', (req, res) => {
  // Request must contain a token
  let token = req.body.token;
  if (!token) {
    // if no token, return an error
    res.json({
      type: 'error',
      message: 'You must include a valid token'
    });
  } else {
    // if token, verify
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      // if any errors during verification, return an error
      if (err) {
        res.json({
          type: 'error',
          message: 'Invalid Token, please log in again'
        });
      } else {
        // if token is valid, use token to lookup user in db
        User.findById(user._id, (err, user) => {
          // if no user, return an error
          if (err) {
            res.json({
              type: 'error',
              message: 'Database error during validation'
            });
          } else {
            // if user, return user and token to front
            res.status(200).json({
              type: 'success',
              user: user.toObject(),
              token
            });
          }
        });
      }
    });
  }
});

module.exports = router;