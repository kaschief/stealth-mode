const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema(
  {
    url: { type: String, required: true },
    owner: [{ type: Schema.Types.ObjectId, ref: "UserModel" }]
  }
  // {
  //   timestamps: {
  //     createdAt: "created_at",
  //     updatedAt: "updated_at"
  //   }
  // }
);

const ArticleModel = mongoose.model("ArticleModel", ArticleSchema);

module.exports = ArticleModel;

// function validURL(str) {
//   var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
//   if (!regex.test(str)) {
//     console.log("Please enter valid URL.");
//     return false;
//   } else {
//     return true;
//   }
// }
