const { agent } = require("supertest");
const app = require("../../app");
const mongodb = require("../../db/connect");

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

    // will be assigned later for testing all ID related endpoints
    let testCourse = {
        _id: undefined, 
        title: undefined, 
        category: undefined,
        date: undefined
    };

    /******************************************
     * Credentials Tests
     ******************************************/
    // Fail to create a new course because user is not logged in
    test("Failed Course Post: User Not Logged In", async () => {
        // setup
        const result = await testRequest.post("/course").send({
            title: "Web Backend Development 2",
            category: "Web Development",
            date: Date.now()
        });
        
        // test
        expect(result.text).toBe("This is a protected resource, log in to continue");

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
        const result = await testRequest.post('/course').send({
            title: "Web Backend Development 2",
            category: "Web Development",
            date: Date.now()
        });

        const data = JSON.parse(result.text);

        // test
        expect(data.message).toBe('New Course Created');
        // end
    });

    // Successfully create a new Course but the date is automatically filled
    test("Successful Course Post: No Date", async () => {
        // setup
        const result = await testRequest.post("/course").send({
            title: "Web Backend Development 2",
            category: "Web Development"
        });

        const data = JSON.parse(result.text);

        // test
        expect(data.message).toBe("New Course Created");
        expect(data.course.date).toBeDefined();
        // end
    });

    // Fail to create a new Course because of missing title
    test("Failed Course Post: Title", async () => {
        // setup
        const result = await testRequest.post("/course").send({
            title: null,
            category: "Web Development",
            date: Date.now()
        });

        const data = JSON.parse(result.text);

        // test
        expect(result.error).toEqual({status: 500, message: "\"title\" is not allowed to be empty"});
        // end
    });

    // Fail to create a new Course because of missing category
    test("Failed Course Post: Category", async () => {
        // setup
        const result = await testRequest.post("/course").send({
            title: "Web Backend Development 2",
            category: null,
            date: Date.now()
        });

        // test
        expect(result.error).toEqual({status: 500, message: "\"category\" is not allowed to be empty"});
        // end
    });

    /******************************************
     * Course Get Tests
     ******************************************/
    // Successfully get all courses
     test("Successful Get All Courses", async () => {
        // setup
        const result = await testRequest.get("/course");
        const data = JSON.parse(result.text);

        // set the testCourse for future tests
        const resultCourse = data[data.length - 1];
        testCourse._id = resultCourse._id;
        testCourse.title = resultCourse.title;
        testCourse.category = resultCourse.category;
        testCourse.date = resultCourse.date;

        // test
        expect(data.message).toBe("Successful Get Request");
        expect(Array.isArray(data)).toBe(true);

        // end
    });

    // Successfully get the testCourse by ID
    test("Successful Get Course by ID", async () => {
        // setup
        const result = await testRequest.get(`/course/${testCourse._id}`);
        const data = JSON.parse(result.text);

        // test
        expect(data.message).toBe("Successful Get Request")
        expect(result._id).toBe(testCourse._id);
        // end
    });

    // Successfully get the testCourse by title
    test("Successful Get Course by Title", async () => {
        // setup
        const result = await testRequest.get(`/course/title/${testCourse.title}`);
        const data = JSON.parse(result.text);

        // test
        expect(data.message).toBe("Successful Get Request");
        expect(result.title).toBe(testCourse.title);

        // end
    });

    // Fail to get testCourse because ID is wrong
    test("Failed Get Course by ID: Wrong ID", async () => {
        // setup
        const result = await testRequest.get("/course/fakeId");

        // test
        expect(result.error).toEqual({
            status: 422, 
            message: "Invalid Course ID"
        });
    
        // end
    });

    // Fail to get the title of a course
    test("Failed Get Course by Title: Wrong Title", async () => {
        // setup
        const result = await testRequest.get("/course/title/fakeTitle");

        // test
        expect(result.error).toEqual({
            status: 404, 
            message: "No courses found"
        });
        
        // end
    });

    /* describe("Update Requests", () => { 
        // setup before each update
        beforeEach(async () => {
            return await mongodb.getDb().db().collection('courses').insertOne(testCourse);
        });

        // teardown after each update
        afterEach(async () => {
            return await mongodb.getDb().db().collection('courses').deleteOne({ _id: testCourse._id });
        });

        /******************************************
         * Course Update Tests
         ******************************************
        // Successfully update the testCourse
        test("Successful Course Put", async () => {
            // setup 
            const result = await testRequest.put(`/course/${testCourse._id}`).send({
                title: "Web Backend Development 2",
                category: "Web Development",
                date: Date.now()
            });

            // test
            expect(result.message).toBe(`Course ${testCourse._id} was updated succesfully`);
            expect(result.result.modifiedCount).toBeTruthy();

            //end
        });

        // Successfully update the testCourse but the date is not needed
        test("Successful Course Put: No Date", async () => {
            // setup 
            const result = await testRequest.put(`/course/${testCourse._id}`).send({
                title: "Web Backend Development 2",
                category: "Web Development"
            });

            // test
            expect(result.message).toBe(`Course ${testCourse._id} was updated succesfully`);
            expect(result.result.modifiedCount).toBeTruthy();

            //end
        });

        // Fail to update testCourse because of missing title
        test("Failed Course Put: Title", async () => {
            // setup
            const result = await testRequest.put(`/course/${testCourse._id}`).send({
                title: null,
                category: "Web Development",
                date: Date.now()
            });

            const data = JSON.parse(result.text);

            // test
            expect(result.error).toEqual({
                status: 500, 
                message: "\"title\" is not allowed to be empty"
            });
            // end
        });

        // Fail to update testCourse because of missing category
        test("Failed Course Put: Category", async () => {
            // setup
            const result = await testRequest.put(`/course/${testCourse._id}`).send({
                title: "Web Backend Development 2",
                category: null,
                date: Date.now()
            });

            // test
            expect(result.error).toEqual({
                status: 500, 
                message: "\"category\" is not allowed to be empty"
            });
            // end
        });
    });

    describe(("Delete Requests"), () => {
        // setup before each delete
        beforeEach(async () => {
            return await mongodb.getDb().db().collection('courses').insertOne(testCourse);
        });

        /******************************************
         * Course Delete Tests
         ******************************************
        // successfully delete the testCourse
        test("Successful Course Delete", async () => {
            // setup
            const result = await testRequest.delete(`/course/${testCourse._id}`);

            // test
            expect(result.message).toBe(`Course ${testCourse._id} was deleted succesfully`);
            // end
        });

        // Fail to delete the testCourse because the ID is wrong
        test("Failed Course Delete", async () => {
            // setup
            const result = await testRequest.delete(`/course/fakeID`);

            // test
            expect(result.error).toEqual({
                status: 422, 
                message: "Invalid Course ID"
            });
            // end
        });
    }); */
};

module.exports = { courseTest };