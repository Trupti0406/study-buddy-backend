const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      unqiue: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 14,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Others"],
      message: "Invalid gender input!",
    },
    photoUrl: {
      type: String,
      default: "https://www.gravatar.com/avatar/000?d=mp",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo url!" + value);
        }
      },
    },
    bio: {
      type: String,
      default:
        "Hey there! I am looking fot a study partner in [xyz] topic, Let's connect!",
    },
    skills: {
      type: [String],
      validate: {
        validator: function (skillsArray) {
          return skillsArray.length <= 10;
        },
        message: "A maximum of 10 skills are allowed.",
      },
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign(
    { _id: user._id },
    "Study@Buddy@by271265#Trupti",
    { expiresIn: "7d" }
  );
  return token;
};
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const hashedPassword = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    hashedPassword
  );
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
