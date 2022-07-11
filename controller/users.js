const User = require("../models/user");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const createError = require("http-errors");

const getUser = () => {};
const getUserById = () => {};
const createUser = async (req, res, next) => {
  /*  
  // #swagger.description = 'Adds a new User'
  #swagger.parameters['User'] = {
                in: 'body',
                description: 'New User',
                schema: {
                    $firstName: 'Shawn',
                    $lastName: 'Potter',
                    $age: 42,
                    $email: 'professor@byui.edu',
                    $password: "Potter11?",
                    $profession: 'Professor',
                }
        }
        #swagger.responses[200] = {
            description: 'User successfully added'}
        #swagger.responses[422] = {
            description: 'Kindly check the provided data'}
            

        */
  const schema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    age: Joi.number().required(),
    profession: Joi.string().required(),
  });

  try {
    const value = await schema.validateAsync(req.body);

    const user = new User({
      firstName: value.firstName,
      lastName: value.lastName,
      password: value.password,
      email: value.email,
      age: value.age,
      profession: value.profession,
    });

    await user.save();

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
