const mongoose = require("mongoose");
const UserModel = require("../models/UserModel");
const ArticleModel = require("../models/ArticleModel");

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

//FOR USERS
let newusersArray = [
  {
    name: "isabella",
    email: "people@motion.com",
    password: "whatthefuck"
  },
  {
    name: "Yoto",
    email: "yoto@dog.com",
    password: "iliketochew"
  },
  {
    name: "Flo",
    email: "flo@flo.com",
    password: "flofloflo"
  }
];

UserModel.create(newusersArray)
  .then(newUsers => {
    console.log(newUsers, newUsers.length, "users were created");
    mongoose.connection.close();
  })
  .catch(err => {
    console.log(err, "sorry users were not created");
  });

//FOR ARTICLES

// ArticleModel.create()
//   .then(newArticles => {
//     console.log(newArticles, newArticles.length, "articles were created");
//     // mongoose.connection.close();
//   })
//   .catch(err => {
//     console.log(err, "sorry articles were not created");
//   });
