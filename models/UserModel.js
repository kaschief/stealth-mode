const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address"
    ]
  },
  password: { type: String, required: true, minlength: 8 }
  //favorites: [{ type: ObjectId, ref: "ArticleModel" }]
});

const UserModel = mongoose.model("UserModel", UserSchema);

module.exports = UserModel;
