const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  url: {
    type: String,
    required: true
    // validate: validURL("string")
  },
  title: { type: String, required: true },
  image: { type: String },
  _owner: { type: Schema.Types.ObjectId, ref: "User" },
  isFavorite: { type: Boolean, default: false }
});

const Article = mongoose.model("Article", ArticleSchema);

//define URL validator

// function validURL(url) {
//   var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
//   if (!regex.test(url)) {
//     console.log("Please enter valid URL");
//     return false;
//   } else {
//     return true;
//   }
// }
module.exports = Article;
