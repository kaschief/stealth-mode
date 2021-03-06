const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const passport = require('passport');
const ensureLogin = require('connect-ensure-login');
const User = require('../models/User');
const Article = require('../models/Article');
const request = require('request');
const cheerio = require('cheerio');

router.get('/', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect('/mylist');
  } else {
    res.render('index');
  }
});

router.get('/login', (req, res, next) => {
  res.render('login', { message: req.flash('error') });
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/mylist',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true,
    badRequestMessage: 'Please enter an email and password to continue.'
  })
);

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  if (name === '' || email === '' || password === '') {
    res.render('signup', {
      errorMessage: 'Please enter name, email and password for signup'
    });
  }

  if (password.length < 8) {
    res.render('signup', {
      errorMessage: 'Please create a password with at least 8 characters'
    });
    return;
  }

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  const newUserObject = {
    name: name,
    email: email,
    password: hashPass
  };

  User.findOne({ email: email })
    .then(user => {
      if (user !== null) {
        res.render('signup', {
          errorMessage: 'The email already exists'
        });
        return;
      }

      User.create(newUserObject)
        .then(_ => {
          res.redirect('/mylist');
        })
        .catch(err => {
          console.log(
            err,
            'User could not be created because this email already exists'
          );
        });
    })
    .catch(err => {
      console.log(err, 'All fields are required.');
    });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/mylist', ensureLogin.ensureLoggedIn(), (req, res) => {
  let userID = req.user.id;

  Article.find({ _owner: userID })
    .sort({ created_at: -1 })
    .then(articles => {
      res.render('mylist', { user: req.user, articles });
    })
    .catch();
});

router.post('/save', ensureLogin.ensureLoggedIn(), (req, res) => {
  const url = req.body.url;
  const userID = req.user.id;

  request(url, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const $ = cheerio.load(body);
      const title = $('head > title')
        .text()
        .trim();

      const receivedParagraph = $('p')
        .first()
        .text();

      function truncate(str) {
        let truncated = str;
        let length = 160;

        if (truncated.length < length) {
          return truncated;
        } else {
          truncated = str.substring(0, length) + '...';
          return truncated;
        }
      }

      const description = truncate(receivedParagraph);
      const image = $('img')[0]['attribs']['src'];

      const newArticle = {
        url: url,
        title: title,
        image: image,
        description: description,
        _owner: userID
      };

      Article.create(newArticle)
        .then(_ => {
          res.redirect('/mylist');
        })
        .catch(err => {
          console.log(err, 'Sorry, article was not created!');
        });
    }
  });
});

router.post(
  '/mylist/:id/delete',
  ensureLogin.ensureLoggedIn(),
  (req, res, next) => {
    const id = req.params.id;

    Article.findByIdAndRemove(id)
      .then(_ => {
        res.redirect('/mylist');
      })
      .catch(err => {
        console.log(err, 'Article was NOT deleted.');
      });
  }
);

router.get('/search', (req, res, next) => {
  let searchTerm = req.query.search;

  console.log(searchTerm);
  Article.find({
    $or: [
      { title: new RegExp(searchTerm, 'gi') },
      { description: new RegExp(searchTerm, 'gi') }
    ]
  }).then(theResult => {
    res.render('search', {
      theResult,
      isNoResult: theResult.length === 0
    });
  });
});

router.get('/favorites', (req, res, next) => {
  res.render('favorites');
});

router.get('/about', (req, res, next) => {
  res.render('about');
});

router.get('/careers', (req, res, next) => {
  res.render('careers');
});

module.exports = router;
