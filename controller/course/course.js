const Course = require("../../models/course");
const Joi = require("joi");
const createError = require("http-errors");
const mongoose = require("mongoose")

// Global Schema
const schema = Joi.object().keys({
  title: Joi.string().required(),
  category: Joi.string().required(),
  date: Joi.date()
});

const addCourse = async (req, res, next) => {
  /*  
  #swagger.description = 'Adds a new Course'
  #swagger.parameters['Course'] = {
    in: 'body',
    description: 'New Course',
    schema: {
      $title: 'CSE341',
      $category: 'Web Development',
      date: '01/01/2022',
      }
  }
  #swagger.responses[201] = { description: 'Course successfully added' }
  #swagger.responses[422] = { description: 'Kindly check the provided data' }
  */
  try {
    const value = await schema.validateAsync(req.body);

    const course = new Course(buildCourse(value))

    const savedCourse = await course.save();

    if(!savedCourse) {
      return next(createError(422, "Course could not be created"));
    }
    res.status(201).json(savedCourse);
  } 
  catch (error) {
    next(error);
  }
};

const getAllCourses = async (req, res, next) => {
  /*  
  #swagger.description = 'Gets all Courses'
  #swagger.responses[200] = { description: 'Successful Get Request' }
  #swagger.responses[404] = { description: 'No Courses Found' }
  */
  try {
    const result = await Course.find();

    if (result.length === 0) {
      return next(createError(404, "No courses found"));
    }
    res.status(200).json(result);
  } 
  catch (error) {
    next(error);
  }
};

const getCourseId = async (req, res, next) => {
  /*  
  #swagger.description = 'Gets one Course using its ID'
  #swagger.responses[200] = { description: 'Successful Get Request' }
  #swagger.responses[404] = { description: 'Course does not exist' }
  #swagger.responses[422] = { description: 'Invalid Course ID' }
  */
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      next(createError(404, "Course does not exist"));
      return;
    }

    res.status(200).json(course);
  } catch (error) {
    if (error instanceof mongoose.CastError) {
      return next(createError(422, "Invalid Course ID"));
    }
    res.status(500).json(error)
  }
};

const getCourseTitle = async (req, res, next) => {
  /*  
  #swagger.description = 'Gets all Courses with the given title'
  #swagger.responses[200] = { description: 'Successful Get Request' }
  #swagger.responses[404] = { description: 'No Courses Found' }
  */
  try {
    const result = await Course.find({ title: req.params.title })

    if (result.length === 0) {
      return next(createError(404, "No courses found"));
    }
    res.status(200).json(result);
  } 
  catch (error) {
    next(error);
  }
};

const updateCourse = async (req, res, next) => {
  /*  
  #swagger.description = 'Updates Course'
  #swagger.parameters['Course'] = {
    in: 'body',
    description: 'Update Course',
    schema: {
      $title: 'CSE341',
      $category: 'Web Development',
      date: '01/01/2022',
      }
  }
  #swagger.responses[201] = { description: 'Course successfully added' }
  #swagger.responses[422] = { description: 'Kindly check the provided data' }
  */
  try {
    const value = await schema.validateAsync(req.body);
    const result = await Course.updateOne(
      {
        _id: req.params.id,
      },
      { $set: value }
    );

    if(result.modifiedCount > 0){
        res
          .status(200)
          .send(`Course ${req.params.id} was updated succesfully`)
    }
    else if (result.matchedCount < 1)
        next(createError(422, "Course does not exist"))
    else {
      res.status(200).send(`No update was made`);
    }
  } 
  catch (error) {
    if (error instanceof mongoose.CastError) {
      next(createError(422, "Invalid course ID"));
      return;
    }
    next(error);
  }
};

const deleteCourse = async (req, res, next) => {
  /*  
  #swagger.description = 'Gets all Courses with the given title'
  #swagger.responses[200] = { description: 'Successful Get Request' }
  #swagger.responses[422] = { description: 'No Courses Found or Bad Course ID' }
  */
  try {
    const result = await Course.deleteOne({
      _id: req.params.id
    });

    if (result.deletedCount < 1) {
      next(createError(422, "Course does not exist"));
      return;
    }

    res
      .status(200)
      .send(`Course ${req.params.id} was deleted succesfully`);
  } 
  catch (error) {
    if (error instanceof mongoose.CastError) {
      next(createError(422, "Invalid Course ID"));
      return;
    }
    next(error);
  }
};

// Not exported, just a helper
function buildCourse (value) {
  const course = {
    title: value.title,
    category: value.category,
    date: value.date
  };
  return course;
}

module.exports = {
  addCourse,
  getAllCourses,
  getCourseTitle,
  getCourseId,
  updateCourse,
  deleteCourse,
};
