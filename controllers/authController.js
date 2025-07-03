const { userModel, validateUser } = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
module.exports.register = async function (req, res) {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const userExists = await userModel.findOne({ email: req.body.email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = await userModel.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const token = jwt.sign({ user: newUser }, process.env.JWT_SECRET, { expiresIn: '34h' });

    res.cookie("token", token, {
      httpOnly: true,
    });

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: {
        user: newUser,
        token : token
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports.login = async function (req, res) {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ user: user }, process.env.JWT_SECRET, { expiresIn: '34h' });
    res.cookie('token', token, {
      httpOnly: true,
    });

    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      data: {
        token: token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports.logout = function(req,res){
    res.clearCookie('token');
    res.status(200).json({
        message : "User Logged Out Sucessfully"
    })
}