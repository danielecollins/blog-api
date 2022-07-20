const { agent } = require("supertest");
const app = require("../../app");
const mongodb = require("../../db/connect");

let testRequest;

//update post
//get post by Id
//get post by title
//get post by user
//get post by category
//delete post

beforeAll(async () => {
  //start server and db

  await mongodb.initDb((err, mongodb) => {
    if (err) {
      console.log(err);
    }
  });

  testRequest = agent(app);
}, 20000);

const postTest = () => {
  let postId;
  let postName;
  let userId;
  let category;

  //get all users
  //should return that user is not logged in
  test("Create a post", async () => {
    const response = await testRequest.post("/posts").send({
      title: "Post Title",
      body: "Post body.",
      category: "Category Name",
    });

    expect(response.text).toBe(
      "This is a protected resource, log in to continue"
    );
  });

  //log admin in has right to manage all users
  test("Log User In", async () => {
    const response = await testRequest.post("/users/auth/login").send({
      email: "professor@byui.edu",
      password: "Potter11?",
    });

    expect(response.text).toBe("User successfully Logged In");
  }, 10000);

  //Create a post now that user is logged in
  test("Create a post", async () => {
    const response = await testRequest.post("/posts").send({
      title: "Post Title",
      body: "Post body.",
      category: "CategoryName",
    });

    const data = JSON.parse(response.text);

    expect(data.message).toBe("New post created");
  });

  //get all posts
  test("Get all posts", async () => {
    const response = await testRequest.get("/posts");
    // get the id of the just created user
    const data = JSON.parse(response.text);

    //get id of the last created user to use for update and delete later
    postId = data[data.length - 1]._id;
    postName = data[data.length - 1].title;
    userId = data[data.length - 1].userid;
    category = data[data.length - 1].category;

    // a logged in user would receive an array of users rather than a text from the first test
    expect(Array.isArray(data)).toBe(true);
  });

  test("Get Post by Id", async () => {
    //checks that the returned value is an object
    const response = await testRequest.get(`/posts/${postId}`);

    const data = JSON.parse(response.text);

    //expect id of returned post to be same as the query
    expect(data._id).toBe(`${postId}`);
  });

  test("Get Post by PostName", async () => {
    //checks that the returned value is an object
    const response = await testRequest.get(`/posts/title/${postName}`);
    const data = JSON.parse(response.text);

    //get id of the last created user to use for update and delete later
    const receivedName = data[data.length - 1].title;

    //expect name of returned post to be same as the query
    expect(receivedName).toBe(`${postName}`);
  });

  test("Get Posts by category", async () => {
    //checks that the returned value is an object
    const response = await testRequest.get(`/posts/category/${category}`);

    const data = JSON.parse(response.text);

    const receivedCategory = data[data.length - 1].category;

    //expect category of returned post to be same as the query
    expect(receivedCategory).toBe(`${category}`);
  });

  test("Get Posts by userId", async () => {
    const response = await testRequest.get(`/posts/user/${userId}`);

    const data = JSON.parse(response.text);

    const receivedUserId = data[data.length - 1].userid;

    //expect userid of returned post to be same as the query
    expect(receivedUserId).toBe(`${userId}`);
  });

  test("Update a Post", async () => {
    const response = await testRequest.put(`/posts/${postId}`).send({
      title: "Post Update Test",
    });

    expect(response.text).toBe(
      `Post with ID ${postId} was updated successfully`
    );
  });

  test("Delete a Post", async () => {
    const response = await testRequest.delete(`/posts/${postId}`);

    expect(response.text).toBe(
      `Post with ID ${postId} was deleted successfully`
    );
  });

  //Log user out
  test("Log User Out", async () => {
    const response = await testRequest.get("/users/auth/logout");

    expect(response.text).toBe("Logout Succeful");
  });
};

module.exports = { postTest };
