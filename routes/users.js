const routes = require('express').Router();
const userController = require('.controllers/users');


//display users data
routes.get('/', userController.getUser);

//get user by username/id?
routes.get('/:id', userController.getUser)

//create new user 
routes.post('/', userController.createUser);

//Update User by id
routes.put('/:id', userController.updateUser);

//Delete User
routes.delete('/:id', userController.deleteUser);

module.exports = routes;
