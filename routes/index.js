const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

//LOGIN

//BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10; //means number of times to shuffle the deck of cards

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  res.redirect("/mylist");
});

//SIGNUP

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", (req, res, next) => {
  res.redirect("/mylist");
});

//LOGOUT
router.get("/logout", (req, res, next) => {
  res.render("index");
});

//MyList

router.get("/mylist", (req, res, next) => {
  res.render("mylist");
});

//FAVORITES
router.get("/favorites", (req, res, next) => {
  res.render("favorites");
});

//ABOUT
router.get("/about", (req, res, next) => {
  res.render("about");
});

//CAREERS

router.get("/careers", (req, res, next) => {
  res.render("careers");
});

module.exports = router;
