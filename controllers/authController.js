const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (id) => {
  return jwt.sign({ id }, "secret word", {
    expiresIn: 60 * 60 * 24 * 3,
  });
};

const handleErr = (err) => {
  const errors = { email: "", password: "" };

  if (err.message === "wrong password") errors.password = "incorrect password";
  if (err.message === "user doesn't exist")
    errors.email = "email is not registered";

  if (err.code === 11000) errors.email = "email is already registered";
  else if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

const singup_get = (req, res) => {
  res.render("signup");
};

const login_get = (req, res) => {
  res.render("login");
};

const singup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const newUser = await userModel.create({ email, password });
    const token = createToken(newUser._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 3,
    });
    res.status(201).json({ user: newUser._id });
  } catch (err) {
    const errors = handleErr(err);
    res.status(400).json({ errors });
  }
};

const login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      maxAge: 1000 * 60 * 60 * 24 * 3,
      httpOnly: true,
    });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErr(err);
    res.status(400).json({ errors });
  }
};

const logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

module.exports = {
  singup_get,
  login_get,
  singup_post,
  login_post,
  logout_get,
};
