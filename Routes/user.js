const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const usersController = require("../Controllers/users.js");
const user = require("../models/user.js")

router.route("/signup")
.get(usersController.renderSignUpForm)
.post(wrapAsync(usersController.signup));

router.route("/login")
.get(usersController.renderLogInForm)
.post(saveRedirectUrl, passport.authenticate("local", {failureRedirect: '/login', failureFlash: true}) ,usersController.login);


router.get("/logout", usersController.logout);

module.exports = router;