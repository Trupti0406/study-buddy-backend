const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    //read the token
    const { token } = req.cookies;
    if (!token) throw new Error("Token is not valid!");
    //validate the token
    const decodedObj = await jwt.verify(token, "Study@Buddy@by271265#Trupti");
    const { _id } = decodedObj;

    //find the user
    const user = await User.findById(_id);
    if (!user) throw new Error("User not found!");

    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
};

module.exports = { userAuth };
