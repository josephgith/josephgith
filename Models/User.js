const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email exists in database"],
      lowercase: true,
      validate: [validator.isEmail, "invalid email format"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [5, "Password must be atleast 6 character in length"],
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.hash(this.password, 10, (err, hash) => {
      if (err) return next(err);
      this.password = hash;
      next();
    });
  }
});

UserSchema.methods.comparePassword = async function (password) {
  try {
    const res = await bcrypt.compare(password, this.password);
    return res;
  } catch (error) {
    console.log(error);
  }
};

module.exports = mongoose.model("User", UserSchema);
