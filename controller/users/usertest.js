const { agent } = require("supertest");
const app = require("../../app");
const mongodb = require("../../db/connect");

let testRequest;

beforeAll(async () => {
  //start server and db

  await mongodb.initDb((err, mongodb) => {
    if (err) {
      console.log(err);
    }
  });

  testRequest = agent(app);
}, 20000);

const userTest = () => {
  let testId;
  //get all users
  //should return that user is not logged in
  test("Get all users", async () => {
    const response = await testRequest.get("/users");

    expect(response.text).toBe(
      "This is a protected resource, log in to continue"
    );
  });

  //create a new user and login
  test("Create a User", async () => {
    const response = await testRequest.post("/users").send({
      firstName: "Shawn",
      lastName: "Potter",
      age: 42,
      email: "profsor@byui.edu",
      password: "Potter11?",
      profession: "Professor",
    });

    const data = JSON.parse(response.text);

    expect(data.message).toBe("User registered and loggedIn successfully");
  });

  //get all users after login
  test("Get all users: called by a logged in user", async () => {
    const response = await testRequest.get("/users");
    // get the id of the just created user
    const data = JSON.parse(response.text);

    //get id of the last created user to use for update and delete later
    testId = data[data.length - 1]._id;

    // a logged in user would receive an array of users rather than a text from the first test
    expect(Array.isArray(data)).toBe(true);
  });

  //Log user out
  test("Log User Out", async () => {
    const response = await testRequest.get("/users/auth/logout");

    expect(response.text).toBe("Logout Succeful");
  });

  //log admin in //hasright to manage all users
  test("Log User In", async () => {
    const response = await testRequest.post("/users/auth/login").send({
      email: "professor@byui.edu",
      password: "Potter11?",
    });

    expect(response.text).toBe("User successfully Logged In");
  }, 10000);

  // The following scenerios
  // is for when a an admin is logged in and makes update and delete the user that was
  // created in the second test

  test("Get user by Id", async () => {
    //checks that the returned value is an object
    const response = await testRequest.get(`/users/${testId}`);

    const data = JSON.parse(response.text);

    //expect id of returned user to be same as the query
    expect(data._id).toBe(`${testId}`);
  });

  test("Update a User", async () => {
    const response = await testRequest.put(`/users/${testId}`).send({
      firstName: "User Test",
    });

    expect(response.text).toBe(
      `User with Id ${testId} was updated succesfully`
    );
  });

  test("Delete a User", async () => {
    const response = await testRequest.delete(`/users/${testId}`);

    expect(response.text).toBe(
      `User with Id ${testId} was deleted succesfully`
    );
  });

  //Log user out
  test("Log User Out", async () => {
    const response = await testRequest.get("/users/auth/logout");

    expect(response.text).toBe("Logout Succeful");
  });
};

module.exports = { userTest };
