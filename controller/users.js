const User = require("../models/user");
const Joi = require("joi");
const createError = require("http-errors");
const mongoose = require("mongoose");

const getUser = async (req, res, next) => {
  try {
    const result = await User.find();

    if (result.length === 0) {
      next(createError(404, "No users found"));
      return;
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      next(createError(422, "User does not exist"));
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    if (error instanceof mongoose.CastError) {
      next(createError(422, "Invalid User ID"));
      return;
    }
    next(error);
  }
};

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

    const savedUser = await user.save();

    req.login(savedUser, function (err) {
      if (err) {
        return next(err);
      }
      return res.json({
        status: 200,
        message: "User registered and loggedIn successfully",
      });
    });
  } catch (error) {
    if (error.name == "ValidationError") {
      next(createError.UnprocessableEntity(error.message));
      return;
    }
    next(error);
  }
};
const updateUser = async (req, res, next) => {
  /*  
  // #swagger.description = 'Update a User'
  #swagger.parameters['User'] = {
                in: 'body',
                description: 'Update a User',
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
            description: 'User successfully updated'}
        #swagger.responses[422] = {
            description: 'Please provide information to be updated, User does not exist, No update was made, Invalid user ID'}
            

        */

  const document = {};
  const keys = [
    "firstName",
    "lastName",
    "email",
    "age",
    "profession",
    "password",
  ];

  //get the values from body
  for (const key in req.body) {
    if (typeof req.body[key] !== "undefined" && keys.includes(key)) {
      document[key] = req.body[key];
    }
  }

  // check the number of items sent for update
  if (Object.keys(document).length < 1) {
    next(createError(422, "Please provide information to be updated"));
    return;
  }

  const schema = Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    password: Joi.string(),
    email: Joi.string().email(),
    age: Joi.number(),
    profession: Joi.string(),
  });

  try {
    const value = await schema.validateAsync(document);

    const updateResult = await User.updateOne(
      {
        _id: req.params.id,
      },
      { $set: value }
    );

    return updateResult.modifiedCount > 0
      ? //if update went through
        res
          .status(200)
          .send(`User with Id ${req.params.id} was updated succesfully`)
      : // if
      updateResult.matchedCount < 1
      ? //if product does not exist
        next(createError(422, "User does not exist"))
      : // product exist but nothing was updated
        res.status(200).send(`No update was made`);
  } catch (error) {
    if (error instanceof mongoose.CastError) {
      next(createError(422, "Invalid user ID"));
      return;
    }
    next(error);
  }
};
const deleteUser = async (req, res, next) => {
  // #swagger.description = 'Delete an existing user'

  /*
              #swagger.responses[200] = {
            description: 'user successfully Deleted'}
            #swagger.responses[422] = {
            description: 'Kindly check the provided Id'}
  
  */

  try {
    const result = await User.deleteOne({
      _id: req.params.id,
    });

    if (result.deletedCount < 1) {
      next(createError(422, "User does not exist"));
      return;
    }

    res
      .status(200)
      .send(`User with Id ${req.params.id} was deleted succesfully`);
  } catch (error) {
    if (error instanceof mongoose.CastError) {
      next(createError(422, "Invalid User ID"));
      return;
    }
    next(error);
  }
};

module.exports = {
  getUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
