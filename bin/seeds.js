const mongoose = require("mongoose");
const User = require("../models/User");
const Article = require("../models/Article");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//Step 1 = Connect to DB using mongoose

mongoose.Promise = Promise;
mongoose
  .connect(
    "mongodb://localhost/stealth-mode",
    { useMongoClient: true }
  )
  .then(() => {
    console.log("Connected to Mongo!");
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

//Step 2 = actually create the model i.e. use Model.create()

// //FOR USERS
// let newusersArray = [
//   {
//     name: "isabella",
//     email: "people@motion.com",
//     password: "whatthefuck"
//   },
//   {
//     name: "Yoto",
//     email: "yoto@dog.com",
//     password: "iliketochew"
//   },
//   {
//     name: "Flo",
//     email: "flo@flo.com",
//     password: "flofloflo"
//   }
// ];

// User.create(newusersArray)
//   .then(newUsers => {
//     console.log(newUsers, newUsers.length, "users were created");
//   })
//   .catch(err => {
//     console.log(err, "sorry users were not created");
//   });

//FOR ARTICLES

//test user creation for first user
let name = "Barack Obama";
let email = "barack@obama.com";
let password = "barack";

const salt = bcrypt.genSaltSync(bcryptSalt);

const newUserObject = {
  name: name,
  email: email,
  password: bcrypt.hashSync(password, salt)
};

User.deleteMany()
  .then(
    User.create(newUserObject).then(user => {
      let id = user._id;
      console.log(user);

      let newArticlesArray = [
        {
          url:
            "https://www.theguardian.com/world/2017/mar/21/hong-kong-china-authoritarian-democracy-one-country-two-systems",
          title:
            "Is it too late to save Hong Kong from Beijing’s authoritarian grasp?",
          image:
            "https://i.guim.co.uk/img/media/20d7f03b1615e69aefec502306eed3e439804d97/0_138_5760_3456/master/5760.jpg?width=1250&quality=85&auto=format&usm=12&fit=max&s=d4c0bde8a91aa277c3a5cc510b0c6419",
          _owner: id,
          isFavorite: false
        },
        {
          url: "https://medium.com/matter/wake-no-more-8bbd49528b9",
          title: "Wake No More",
          image:
            "https://cdn-images-1.medium.com/max/2000/1*PK6xLCcI2Y6h9c1C3aJzIA.jpeg",
          _owner: id,
          isFavorite: false
        },
        {
          url:
            "http://nymag.com/selectall/2016/10/the-kink-in-elon-musks-hyperloop.html",
          title: "A Kink in the Hyperloop",
          image:
            "https://pixel.nymag.com/imgs/daily/selectall/2016/10/14/magazine/17-hyperloop-lede-new.w512.h600.2x.jpg",
          _owner: id,
          isFavorite: false
        }
      ];

      Article.create(newArticlesArray)
        .then(newArticles => {
          console.log(newArticles, newArticles.length, "articles were created");
          mongoose.connection.close();
        })
        .catch(err => {
          console.log(err, "sorry articles were not created");
        });
    })
  )
  .catch(err => "Sorry, users could not be deleted");
