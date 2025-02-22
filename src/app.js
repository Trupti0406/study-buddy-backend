const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

//Routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

//get single user by email id
app.get("/user", async (req, res) => {
  try {
    const user = await User.find({ emailId: req.body.emailId });
    res.send(user);
  } catch (error) {
    res.send("Internal server error");
  }
});

app.get("/feed", (req, res) => {});

//update user by ID
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "skills"];
    const isUpdateAllowed = Object.keys(req.body).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed!");
    }
    const user = await User.findById(userId); // Find the user
    if (!user) {
      return res.status(404).send({ error: "User not found!" });
    }

    Object.assign(user, req.body);
    await user.save();

    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error.message });
  }
});

connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
