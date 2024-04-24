const request = require("supertest");
const sinon = require('sinon');
const middleware = require('../middleware/auth.js');
const mongoose = require('mongoose');
var app;

let userEmail = "john" + Math.random() + "@testing.com";
let userPassword = "ABC" + Math.random();

const newUser = {
  email: userEmail,
  password: userPassword,
};

beforeAll(async () => {
  //Replace the middleware function with a fake function that passes the request through.
  sinon.stub(middleware, "userVerification")
  .callsFake(function userVerification(req, res, next) {
      return next();
  });

  //You need to declare this after the fake function is made
  app = require("../app");
});

afterAll(async () => {
  //Restore middleware function to the original state
  middleware.userVerification.restore();
  mongoose.disconnect;
});

/* ChatGPT4 assistance >> */

// test user creation
// this test has been slightly modified as this API call is now under th login.js route - Fernando
describe("POST /login/create", () => {
  it("should create a new user", async () => {
    // post request to create a new user
    const response = await request(app).post("/login/create").send(newUser);
    // check if correct user in reponse
    expect(response.statusCode).toBe(201);
    expect(response.body.email).toBe(newUser.email);
  });
});

describe("GET /users/:email", () => {
  it("should retrieve a user by email", async () => {
    const response = await request(app).get(`/users/${userEmail}`);
    // expect 200 response
    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe(userEmail);
  });

  it("should return 404 for a non-existent user", async () => {
    let nonExistentEmail = "nonexistent" + Math.random() + "@testing.com";
    // get request for a non-existent user
    const response = await request(app).get(`/users/${nonExistentEmail}`);
    // expect 404 response not found
    expect(response.statusCode).toBe(404);
  });
});

describe("DELETE /users/:email", () => {
  it("should delete a user by id", async () => {
    const response1 = await request(app).delete(`/users/${newUser.email}`);
    // expect 200 response
    expect(response1.statusCode).toBe(200);
    expect(response1.body.message).toBe("User deleted successfully");

    // Verify the user has been deleted from the database
    const response2 = await request(app).get(`/users/${newUser.email}`);
    expect(response2.statusCode).toBe(404);
  });

  it("should return 404 for a non-existent user", async () => {
    const response = await request(app).delete(`/users/${newUser.email}`);
    // expect 404 response not found
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("User not found");
  });
});

/* << ChatGPT4 assistance */
