const { agent } = require("supertest");
const app = require("../../app");
const mongodb = require("../../db/connect");
const mongoose = require("mongoose");

let testRequest;

// Initialize the database connection before each test
beforeAll(async () => {
  await mongodb.initDb((err, mongodb) => {
    if (err) {
      console.log(err);
    }
  });

  testRequest = agent(app);
}, 20000);

const courseTest = () => {

    // for testing endpoints that need course info. _id will be set later
    const testCourse = {
        title: "Web Backend Development 2",
        category: "Web Development",
        date: Date.now()
    };

    /******************************************
     * Credentials Tests
     ******************************************/
    // Fail to create a new course because user is not logged in
    test("Failed Course Post: User Not Logged In", async () => {
        // setup
        const result = await testRequest.post("/courses").send(testCourse);
        
        // test
        expect(result.text).toBe(
            "This is a protected resource, log in to continue"
        );

        //end
    });

    // Login as admin so that we can run the rest of the tests
    test("Admin Login", async () => {
        // setup
        const result = await testRequest.post("/users/auth/login").send({
          email: "professor@byui.edu",
          password: "Potter11?",
        });
    
        // test
        expect(result.text).toBe("User successfully Logged In");

        // end
    }, 10000);

    /******************************************
     * Course Post Tests
     ******************************************/
    // Successfully create a new Course
    test("Successful Course Post", async () => {
        // setup 
        const result = await testRequest.post('/courses').send(testCourse);

        const data = JSON.parse(result.text);

        // test
        expect(data.message).toBe('New Course Created');
        // end
    });

    // Successfully create a new Course but the date is automatically filled
    test("Successful Course Post: No Date", async () => {
        // setup
        const result = await testRequest.post("/courses").send({
            title: testCourse.title,
            category: testCourse.category
        });

        const data = JSON.parse(result.text);

        // test
        expect(data.message).toBe("New Course Created");
        expect(data.course.date).toBeDefined();
        // end
    });

    // Fail to create a new Course because of missing title
    test("Failed Course Post: No Title", async () => {
        // setup
        const result = await testRequest.post("/courses").send({
            title: "",
            category: testCourse.category,
            date: testCourse.date
        });

        const data = JSON.parse(result.text);

        // test
        expect(data.error).toEqual({status: 500, message: "\"title\" is not allowed to be empty"});
        // end
    });

    // Fail to create a new Course because of missing category
    test("Failed Course Post: Null Category", async () => {
        // setup
        const result = await testRequest.post("/courses").send({
            title: "Web Backend Development 2",
            category: "",
            date: Date.now()
        });

        const data = JSON.parse(result.text);

        // test
        expect(data.error).toEqual({status: 500, message: "\"category\" is not allowed to be empty"});
        // end
    });

    /******************************************
     * Course Get Tests
     ******************************************/
    // Successfully get all courses
     test("Successful Get All Courses", async () => {
        // setup
        const result = await testRequest.get("/courses");
        const data = JSON.parse(result.text);

        // test
        expect(data.message).toBe("Successful Get Request");
        expect(Array.isArray(data.result)).toBe(true);

        // set _id for future tests
        testCourse._id = data.result[data.result.length - 1]._id;

        // end
    });

    // Successfully get the testCourse by ID
    test("Successful Get Course by ID", async () => {
        // setup
        const result = await testRequest.get(`/courses/${testCourse._id}`);
        const data = JSON.parse(result.text);

        // test
        expect(data.message).toBe("Successful Get Request")
        expect(data.result._id).toBe(testCourse._id);
        // end
    });

    // Successfully get the testCourse by title
    test("Successful Get Course by Title", async () => {
        // setup
        const result = await testRequest.get(`/courses/title/${testCourse.title}`);
        const data = JSON.parse(result.text);

        // test
        expect(data.message).toBe("Successful Get Request");
        expect(data.result.title).toBe(testCourse.title);

        // end
    });

    // Fail to get testCourse because ID is wrong
    test("Failed Get Course by ID: Wrong ID", async () => {
        // setup
        const result = await testRequest.get("/courses/fakeId");

        // test
        expect(result.status).toBe(422);
    
        // end
    });

    // Fail to get the title of a course
    test("Failed Get Course by Title: Wrong Title", async () => {
        // setup
        const result = await testRequest.get("/courses/title/fakeTitle");

        // test
        expect(result.status).toBe(500);
        
        // end
    });

    /******************************************
     * Course Update Tests
     ******************************************/
    // Successfully update the testCourse
    test("Successful Course Put", async () => {
        // setup 
        const result = await testRequest.put(`/courses/${testCourse._id}`).send({
            title: "Different",
            category: testCourse.category,
            date: testCourse.date
        });

        const data = JSON.parse(result.text);

        // test
        expect(data.message).toBe(`Course ${testCourse._id} was updated succesfully`);
        expect(data.result.modifiedCount).toBeTruthy();

        //end
    });

    // Successfully update the testCourse but the date is not needed
    test("Successful Course Put: No Date", async () => {
        // setup 
        const result = await testRequest.put(`/courses/${testCourse._id}`).send({
            title: testCourse.title,
            category: testCourse.category
        });

        const data = JSON.parse(result.text);

        // test
        expect(data.message).toBe(`Course ${testCourse._id} was updated succesfully`);
        expect(data.result.modifiedCount).toBeTruthy();

        //end
    });

    // Fail to update testCourse because of missing title
    test("Failed Course Put: Title", async () => {
        // setup
        const result = await testRequest.put(`/courses/${testCourse._id}`).send({
            title: "",
            category: testCourse.category,
            date: testCourse.date
        });

        const data = JSON.parse(result.text);

        // test
        expect(data.error).toEqual({
            status: 500, 
            message: "\"title\" is not allowed to be empty"
        });
        // end
    });

    // Fail to update testCourse because of missing category
    test("Failed Course Put: Category", async () => {
        // setup
        const result = await testRequest.put(`/courses/${testCourse._id}`).send({
            title: testCourse.title,
            category: "",
            date: testCourse.date
        });

        const data = JSON.parse(result.text);

        // test
        expect(data.error).toEqual({
            status: 500, 
            message: "\"category\" is not allowed to be empty"
        });
        // end
    });

    describe(("Delete Requests"), () => {

        /******************************************
         * Course Delete Tests
         ******************************************/
        // successfully delete the testCourse
        test("Successful Course Delete", async () => {
            // setup
            const result = await testRequest.delete(`/courses/${testCourse._id}`);

            // test
            expect(result.text).toBe(`Course ${testCourse._id} was deleted succesfully`);
            // end
        });

        // Fail to delete the testCourse because the ID is wrong
        test("Failed Course Delete", async () => {
            // setup
            const result = await testRequest.delete(`/courses/fakeID`);

            // test
            expect(result.status).toBe(422);
            // end
        });
    }); 
    //Log user out
    test("Admin Logout", async () => {
        const response = await testRequest.get("/users/auth/logout");

        expect(response.text).toBe("Logout Succeful");
    });
};

module.exports = { courseTest };