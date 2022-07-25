const express = require("express");
const dotenv = require("dotenv");
const db = require("./db/db.js");
const path = require("path");
const UserModel = require("./Models/User.js");
const formatError = require("mongoose-error-formatter");
const bcrypt = require("bcryptjs");
dotenv.config();

const app = express();
//set view engine
app.set("view engine", "ejs");
//set static folders
app.use(express.static(path.join(__dirname, "public")));
//set body-parser middleware
app.use(express.urlencoded({ extended: true }));

app
  .route("/")
  .get((req, res) => {
    res.render("Register.ejs");
  })
  .post((req, res) => {
    const { name, email, password } = req.body;
    UserModel.create({ name, email, password })
      .then(() => {
        return res.render("Register.ejs", {
          success: "Registration successfull, kindly login",
        });
      })
      .catch((err) => {
        return res.render("Register.ejs", {
          error: formatError(err),
          email,
          name,
        });
      });
  });

app
  .route("/login")
  .get((req, res) => {
    res.render("Login.ejs");
  })
  .post(async (req, res) => {
    const { email, password } = req.body;
    if (email === "" || password === "") {
      return res.render("Login.ejs", { error: "Please fill in all fields" });
    }
    const checkEmail = await UserModel.findOne({ email });
    if (!checkEmail) {
      return res.render("Login.ejs", { error: "Username or password invalid" });
    }
    const checkPassword = await checkEmail.comparePassword(password);
    if (!checkPassword) {
      return res.render("Login.ejs", { error: "Username or password invalid" });
    }
    res.redirect("/dashboard/" + checkEmail._id);
  });

app.get("/dashboard/:id", async (req, res) => {
  const id = req.params.id;
  const user = await UserModel.findById(id);
  console.log(user);
  if (!user) {
    return res.redirect("/login");
  }
  res.render("Dashboard.ejs", { user });
});

app.listen(8888, () => console.log("server runing"));
