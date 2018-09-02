const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
    res.render('index');
});

// GET SIGNUP, Logout and LOGIN Pages
router.get('/login', (req, res, next) => {
    res.render('login');
});

router.get('/signup', (req, res, next) => {
    res.render('signup');
});

router.get('/logout', (req, res, next) => {
    res.render('logout');
});

//GET MyList and Favourites, Careers and About

router.get('/mylist', (req, res, next) => {
    res.render('mylist');
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
