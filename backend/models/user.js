const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  phone: { type: Number, require: true },
  password: { type: String, require: true },
  confirmPassword: { type: String, require: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
