const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const User = require("../models/User");
const Article = require("../models/Article");
const request = require("request");
const cheerio = require("cheerio");

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
      res.render("mylist", { user: req.user, articles });
    })
    .catch();
});

//SAVE ARTICLE SECTION

router.post("/save", ensureLogin.ensureLoggedIn(), (req, res) => {
  const url = req.body.url;
  const userID = req.user.id;

  request(url, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const $ = cheerio.load(body);

      //find the title in the head, take text, then trim
      const title = $("head > title").text();
      // .trim();

      //find the first paragraph then take the text
      const description = $("p")
        .first()
        .text();

      //find a p greater than 100?
      // $("p").filter(function() {
      //   return $(this).text().length > 100;
      // });

      const image = $("img")[0]["attribs"]["src"];

      // create the newArticle Object

      const newArticle = {
        url: url,
        title: title,
        image: image,
        description: description,
        _owner: userID
      };

      //console.log("This is the new article Object", newArticle);

      //Create new Article

      Article.create(newArticle)
        .then(createdArticle => {
          console.log(createdArticle, "Article successfully created");
          res.redirect("/mylist");
        })
        .catch(err => {
          console.log(err, "Sorry, article was not created!");
        });
    }
  });
});

//DELETE ARTICLE SECTION

router.post(
  "/mylist/:id/delete",
  ensureLogin.ensureLoggedIn(),
  (req, res, next) => {
    const id = req.params.id;
    Article.findByIdAndRemove(id)
      .then(_ => {
        console.log("Article was DELETED!");
        res.redirect("/mylist");
      })
      .catch(err => {
        console.log(err, "Article was NOT deleted.");
      });
  }
);

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
