const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

// Create a schema
const userSchema = new Schema({
  method: {
    type: String,
    enum: ["local", "google", "facebook"],
    required: true,
  },

  local: {
    email: {
      type: String,
      lowercase: true,
    },
    password: {
      type: String,
    },
    name: String,
    activate: {
      type: Boolean,
      default: false,
    },
    reset_password: {
      code: String,
      expire_timestamp: String,
      created_timestamp: String,
      verified: Boolean,
    },
  },

  google: {
    id: String,
    email: {
      type: String,
      lowercase: true,
    },
    name: String,
  },
  facebook: {
    id: String,
    email: {
      type: String,
      lowercase: true,
    },
    name: String,
  },
  userInfo: [
    {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      salary: { type: String, required: true },
      post: { type: String, required: true },
      picture: { type: String, required: true },
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (this.method !== "local") {
    return next();
  }
  try {
    //Generate a salt
    const salt = await bcrypt.genSalt(10);
    //Generate a password hash (salt + hash)
    const passwordHash = await bcrypt.hash(this.local.password, salt);
    //Re-assign hashed version over original, plain text password
    this.local.password = passwordHash;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isValidPassword = async function (enterednewpassword) {
  try {
    return await bcrypt.compare(enterednewpassword, this.local.password);
  } catch (error) {
    throw new Error(error);
  }
};

//Create a model
const User = mongoose.model("user", userSchema);

//Export the model

module.exports = User;
