const User = require("../models/user");
const Joi = require("joi");

const getUser = () => {};
const getUserById = () => {};
const createUser = async (req, res, next) => {
  const schema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    age: Joi.number().required(),
    profession: Joi.string().required(),
  });

  try {
    const value = schema.validateAsync(req.body);

    const user = new User({
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      age: value.age,
      profession: value.profession,
    });

    const result = await user.save();

    res.json({
      status: 200,
      message: "User registered successfully",
    });
  } catch (error) {
    if (error.name == "ValidationError") {
      next(createError.UnprocessableEntity(error.message));
      return;
    }
    next(error);
  }
};
const updateUser = () => {};
const deleteUser = () => {};
const auth = () => {};
const logout = () => {};
const UserByUsername = () => {};

module.exports = {
  getUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  auth,
  logout,
  UserByUsername,
};
