const mongoose = require("mongoose");
const Joi = require("joi");

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  tags: [
    {
      type: String,
    },
  ],
  images: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  comments: [
    {
      comment: {
        type: String,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
});

const validateBlog = (blog) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    author: Joi.string(),
    tags: Joi.array().items(Joi.string()),
    images: Joi.array().items(Joi.string()),
    createdAt: Joi.date(),
    comments: Joi.array().items(
      Joi.object({
        comment: Joi.string(),
        user: Joi.string(),
      })
    ),
  });
  return schema.validate(blog);
};

const blogModel = mongoose.model("Blog", blogSchema);

module.exports = { validateBlog, blogModel };
