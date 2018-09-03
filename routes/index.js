const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const User = require("../models/User");
const Article = require("../models/Article");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

//LOGIN SECTION

/* GET to ARRIVE at the LOGIN page */
router.get("/login", (req, res, next) => {
  res.render("login", { message: req.flash("error") });
});

//POST to SUBMIT once at the LOGIN page

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/mylist",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true,
    badRequestMessage: "Your message you want to change."
  })
);

//SIGNUP SECTION
/* GET to ARRIVE at the SIGNUP page */

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

//POST to SUBMIT once at the SIGNUP page

router.post("/signup", (req, res, next) => {
  //captures name, email and password from body
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  // if name, email or password is blank, then render error
  if (name === "" || email === "" || password === "") {
    res.render("signup", {
      errorMessage: "Please enter name, email and a password for signup"
    });
  }

  //check is password length is greater than 8
  if (password.length < 8) {
    res.render("signup", {
      errorMessage: "Please create a password with 8 or more characters"
    });
    return;
  }

  //applies encryption (using salt method) to password - standard, don't change

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  //finally creates new user and add to Model/databse
  //use Model.create()

  //create new user object with entered name, email and encrypted password
  const newUserObject = {
    name: name,
    email: email,
    password: hashPass
  };

  // search if email already exists, else render error

  User.findOne({ email: email })
    .then(user => {
      if (user !== null) {
        res.render("signup", {
          errorMessage: "The email already exists"
        });
        return;
      }

      // if email does not exist, create new Model
      User.create(newUserObject)
        .then(createdUser => {
          console.log(createdUser, "User was successfully created");
          res.redirect("/mylist");
        })
        .catch(err => {
          console.log(
            err,
            "User could not be created because this email already exists"
          );
        });
    })
    .catch(err => {
      console.log(err, "All fields are required.");
    });
});

//LOGOUT SECTION
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

//MYLIST SECTION

router.get("/mylist", ensureLogin.ensureLoggedIn(), (req, res) => {
  //check user's ID
  let userID = req.user.id;
  console.log(userID);

  //display all articles
  Article.find()
    .then(articles => {
      let articleID = articles._id;
      console.log(articles, userID), articleID;
      res.render("mylist", { user: req.user, articles });
    })
    .catch();
});

//SAVE ARTICLE SECTION

router.post("/save", ensureLogin.ensureLoggedIn(), (req, res) => {
  //take from the form
  res.render("mylist", { user: req.user });
});

//FAVORITES SECTION
router.get("/favorites", (req, res, next) => {
  res.render("favorites");
});

//ABOUT SECTION
router.get("/about", (req, res, next) => {
  res.render("about");
});

//CAREERS SECTION

router.get("/careers", (req, res, next) => {
  res.render("careers");
});

module.exports = router;
