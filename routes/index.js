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

  //display all articles
  Article.find({ _owner: userID })
    .then(articles => {
      console.log(
        articles,
        "This is the CURRENT LOGGED IN USER ----------",
        userID
      );
      res.render("mylist", { user: req.user, articles });
    })
    .catch();
});

//SAVE ARTICLE SECTION

router.post("/save", ensureLogin.ensureLoggedIn(), (req, res) => {
  //take data from the form

  console.log(req.body);
  res.redirect("/mylist");
  // let newArticleObject = {
  //   url:
  //     "https://www.theatlantic.com/politics/archive/2018/09/barack-obama-eulogy-john-mccain/569065/?utm_content=edit-promo&utm_term=2018-09-01T16%3A20%3A56&utm_campaign=the-atlantic&utm_medium=social&utm_source=twitter",
  //   title: "Barack Obama's Eulogy for John McCain",
  //   image:
  //     "https://cdn.theatlantic.com/assets/media/img/mt/2018/09/AP_18244565759833/lead_720_405.jpg?mod=1535818855",
  //   _owner: "5b8d2ea2ebebdc07fd83ab90",
  //   isFavorite: false
  // };

  // Article.create(newArticleObject)
  //   .then(article => {
  //     console.log(article, "NEW article successfully created");
  //     res.render("mylist", { user: req.user });
  //   })
  //   .catch(err => {
  //     console.log(err, "Sorry, NEW article was not created!");
  //   });
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
