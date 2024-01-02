const mongoose = require("mongoose");
const { default: isEmail } = require("validator/lib/isemail");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "please enter a password"],
    minlength: [8, "minimum password length is 8"],
  },
});

userSchema.post("save", function (doc, next) {
  console.log("user saved", doc);
  next();
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(user.password, password);
    if (auth) {
      return user;
    }
    throw Error("wrong password");
  }
  throw Error("user doesn't exist");
};

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
