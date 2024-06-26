const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a name"],
    },
    email: {
      type: String,
      required: [true, "Please enter an email"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minLength: [6, "Password must be atleast 6 characters long"],
      maxLength: [16, "Password must be not more than 16 chracters"],
    },
    photo: {
      type: String,
      required: false,
      default: "<Link to default photo>",
    },
    phone: {
      type: String,
    },
    bio: {
      type: String,
      maxLength: [255, "Bio must not exceed 255 characters"],
      default: "Tell more about yourself!",
    },
  },
  {
    timestamps: true,
  }
);

// A functionality to save hashed password in the db
// this works everytime password is changed or a new user is added
// we are adding a pre method meaning before saving a user as per the model do the following

userSchema.pre("save", async function (next) {
  // if password is not modified then just let it be we dont need to update it
  if (!this.isModified("password")) {
    return next();
  }
  // if not then hash the password
  // logic to hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
