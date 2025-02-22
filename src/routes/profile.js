const express = require("express");
const { userAuth } = require("../middleware/auth");
const { validteEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const profileRouter = express.Router();

//profile view
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

//profile edit
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validteEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    //daving the user in db
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, your profile is updated successfully!`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

// password update
profileRouter.patch("/profile/updatePassword", userAuth, async (req, res) => {
  try {
    //take oldpassword, new and confirm
    const { oldPassword, newPassword, confirmPassword } = req.body;

    //take user
    const user = req.user;

    //check if all filed are provided
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }
    //chekc if old password is correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect." });

    //check if new password matches cofirm one
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message:
          "Make sure you New Password and Confirm Password filed match!!!",
      });
    }
    //has new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    //update the password in db
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully!" });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});
module.exports = profileRouter;
