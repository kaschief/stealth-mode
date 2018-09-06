const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema(
  {
    url: {
      type: String,
      required: true
    },
    title: { type: String, required: true },
    image: { type: String },
    description: { type: String },
    _owner: { type: Schema.Types.ObjectId, ref: "User" },
    isFavorite: { type: Boolean, default: false }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
