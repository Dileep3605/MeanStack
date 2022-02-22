const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: hash,
      confirmPassword: hash,
    });
    user
      .save()
      .then((createdUser) => {
        res.status(201).json({
          message: "User created successfully",
          userDetail: createdUser,
          isUserCreated: true
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let loginDetail = req.body;
  let userDetail;
  User.findOne({ email: loginDetail.username })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      userDetail = user;
      return bcrypt.compare(loginDetail.password, userDetail.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      const token = jwt.sign(
        { email: loginDetail.username, userId: userDetail._id },
        "Mean_Stack_Project_Front_End_Development",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expireTime: 3600,
        userId: userDetail._id
      });
    })
    .catch((err) => {
      console.log("Test 5");
      console.log(err);
      return res.status(401).json({
        message: "Auth failed",
      });
    });
});

module.exports = router;
