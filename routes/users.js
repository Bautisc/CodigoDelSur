const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const bodyParser = require("body-parser");

//=== Body Parser ===//

router.use(bodyParser.json());

const PATH_users = "./users.txt";
//Registrar usuario
router.post("/register", (req, res) => {
  fs.readFile(PATH_users, "utf-8", (err, data) => {
    if (err) {
      res.status(400);
      return;
    }
    const user = data ? JSON.parse(data) : [];
    const result = user.find((user) => user.email === req.body.email);
    if (result) {
      res.status(200).json({
        msg: "Email already in use.",
      });
      return;
    }
    user.push({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
    });
    fs.writeFile(PATH_users, JSON.stringify(user), (err) => {
      if (err) throw err;
      res.status(200).json({
        msg: "User succesfully created.",
        body: req.body,
      });
    });
  });
});
//Autenticar usuario
router.post("/login", (req, res) => {
  fs.readFile(PATH_users, "utf-8", (err, data) => {
    if (err) {
      res.status(400);
      return;
    }
    const user = data ? JSON.parse(data) : [];
    const result = user.find((user) => user.email === req.body.email && user.password === req.body.password);

    if (result) {
      jwt.sign({ result }, "secretkey", (err, token) => {
        res.send({
          msg: "Login Success.",
          token,
        });
      });
    } else {
      res.json("Email or password are incorrect.");
    }
  });
});

module.exports = router;
