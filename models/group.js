const mongoose = require("mongoose");
const Joi = require("joi");

const groupSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  members: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      role: {
        type: String,
        default: "member",
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  messages: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      content: {
        type: String,
      },
      timeStamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const validateGroup = (group) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    members: Joi.array().items(Joi.string()),
    createdAt: Joi.date(),
  });
  return schema.validate(group);
};

const groupModel = mongoose.model("Group", groupSchema);

module.exports = { validateGroup, groupModel };
