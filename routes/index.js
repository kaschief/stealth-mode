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

router.get("/", (req, res, next) => {
  if (req.isAuthenticated) {
    res.redirect("/mylist");
  } else res.render("index");
});

//LOGIN SECTION

router.get("/login", (req, res, next) => {
  res.render("login", { message: req.flash("error") });
});

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

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  if (name === "" || email === "" || password === "") {
    res.render("signup", {
      errorMessage: "Please enter name, email and a password for signup"
    });
  }

  if (password.length < 8) {
    res.render("signup", {
      errorMessage: "Please create a password with 8 or more characters"
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
        res.render("signup", {
          errorMessage: "The email already exists"
        });
        return;
      }
      User.create(newUserObject)
        .then(_ => {
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
  let userID = req.user.id;

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
      const title = $("head > title")
        .text()
        .trim();

      const receivedParagraph = $("p")
        .first()
        .text();

      function truncate(str) {
        let truncated = str;
        let length = 160;

        if (truncated.length < length) {
          return truncated;
        } else {
          truncated = str.substring(0, length) + "...";
          return truncated;
        }
      }

      const description = truncate(receivedParagraph);
      const image = $("img")[0]["attribs"]["src"];

      const newArticle = {
        url: url,
        title: title,
        image: image,
        description: description,
        _owner: userID
      };

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
