const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const UserModel = require("../models/UserModel");
const ArticleModel = require("../models/ArticleModel");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/mylist", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("mylist", { user: req.user });
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
    passReqToCallback: true
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

  // if name, email or password is blank, then render error
  if (
    // !name ||
    // !email ||
    // !password ||
    // name === null ||
    // email === null ||
    // password === null ||
    name === "" ||
    email === "" ||
    password === ""
  ) {
    res.render("signup", {
      errorMessage: "Please enter name, email and a password for signup"
    });
  }
  // search if email already exists, else render error

  UserModel.findOne({ email: email })
    .then(user => {
      if (user !== null) {
        res.render("signup", {
          errorMessage: "The email already exists"
        });
        return;
      }

      // if email does not exist, create new Model
      UserModel.create(newUserObject)
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
