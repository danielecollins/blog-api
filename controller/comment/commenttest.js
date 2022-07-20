const { agent } = require("supertest");
const app = require("../../app");
const mongodb = require("../../db/connect");
require("dotenv")

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


  const commentTest = () => {
    let postId;
    let commentId;
    let userId;

  //should return that user is not logged in

  test("Create a comment when user isn't logged in", async () => {
    const response = await testRequest.post("/comments").send({
      comment: "My name is samolala",
      postId: "5e9f8f8f8f8f8f8f8f8f8f8",
    });
    
    const data = JSON.parse(response.text);

    expect(data.error.message).toBe("User Is not logged in");
  });

  test("Log User In", async () => {
    const response = await testRequest.post("/users/auth/login").send({
      email: "professor@byui.edu",
      password: "Potter11?",
    });

    expect(response.text).toBe("User successfully Logged In");
  }, 10000);

  test("Create a comment when user is logged in", async () => {
    const response = await testRequest.post("/comments").send({
      comment: "My name is samolala",
      postId: "5e9f8f8f8f8f8f8f8f8f8f8",
    });
    
    const data = JSON.parse(response.text);

    expect(data.comment).toBe("My name is samolala");
    expect(data.postId).toBe("5e9f8f8f8f8f8f8f8f8f8f8");
    expect(data.userId).not.toBe(null);
    expect(data._id).not.toBe(null);

    postId = data.postId;
    commentId = data._id;
    userId = data.userId;
    comment = data.comment;
    
  });

    test("Get comment by post id", async () => {

    const response = await testRequest.get(`/comments/postId/${postId}`);

    const data = JSON.parse(response.text);


    expect(data[0].postId).toBe(postId);
    expect(data.comment).not.toBe(null);
    expect(data.userId).not.toBe(null);
    expect(data._id).not.toBe(null);

    });

    
    test("Get comment by comment id", async () => {

        const response = await testRequest.get(`/comments/${commentId}`);
        const data = JSON.parse(response.text);
    
        expect(data._id).toBe(commentId);
        expect(data.comment).not.toBe(null);
        expect(data.userId).not.toBe(null);
        expect(data.postId).not.toBe(null);

    
        });

    test("Get comment by user id", async () => {

        const response = await testRequest.get(`/comments/user/${userId}`);
        const data = JSON.parse(response.text);
        
        expect(data[0].userId).toBe(userId);
        expect(data.comment).not.toBe(null);
        expect(data.postId).not.toBe(null);
        expect(data._id).not.toBe(null);

        });

        test("Update a comment", async () => {
            const response = await testRequest.put(`/comments/${commentId}`).send({
                comment: "My name is David",
                postId: "5e9f8f8f8f8f8f8f8f8f8f8",
                userId: userId,
            });

            const data = JSON.parse(response.text);
        
            expect(data.message).toBe("Comment updated successfully!");

            });
        
          test("Delete a comment", async () => {
            const response = await testRequest.delete(`/comments/${commentId}`);
        
            const data = JSON.parse(response.text);

            expect(data.message).toBe("Successfully deleted one document.");
          });


}

module.exports = { commentTest };