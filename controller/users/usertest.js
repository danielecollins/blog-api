const User = require("../../models/user");
const mongoose = require("mongoose");
const { agent, SuperAgentTest } = require("supertest");
const app = require("../../app");
const mongodb = require("../../db/connect");
const { request } = require("../../app");

let testRequest;

beforeAll(() => {
  //start server and db

  mongodb.initDb((err, mongodb) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Connected to DB`);
    }
  });

  testRequest = agent(app);
}, 20000);

const userTest = () => {
  //get all users
  //should return that user is not logged in
  test("Get all users", async () => {
    const response = await testRequest.get("/users");

    expect(response.text).toBe(
      "This is a protected resource, log in to continue"
    );
  });

  //log user in
  test("Log User In", async () => {
    const response = await testRequest.post("/users/auth/login").send({
      email: "professor@byui.edu",
      password: "Potter11?",
    });

    expect(response.text).toBe("User successfully Logged In");
  }, 10000);

  test("Get all lusers", async () => {
    const response = await testRequest.get("/users");

    console.log(response.text);
  });
};

module.exports = { userTest };
