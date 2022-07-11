const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    age: {
      type: String,
    },
    profession: {
      type: String,
    },
    password: {
      type: String,
    },
    level: {
      type: String,
      default: "author",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    strict: false,
    collection: "users",
  }
);

userSchema.pre("save", (next) => {
  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, async function (err, hash) {
      if (err) return next(err);

      user.password = hash;

      next();
    });
  });
});

userSchema.pre("updateOne", function (next) {
  // only hash the password if it has been modified (or is new)
  const password = this.getUpdate().$set.password;
  const self = this;

  if (!password) {
    return next();
  }

  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(password, salt, async function (err, hash) {
      if (err) return next(err);

      self.getUpdate().$set.password = hash;

      next();
    });
  });
});

module.exports = mongoose.model("User", userSchema);
