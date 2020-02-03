require("dotenv").config();
const request = require("supertest");
const app = require("../server");

describe("POST /users/authenticate", function() {
  it("respond with 200 ok, because of correct input", function(done) {
    let data = {
      username: "User",
      password: "123456789",
    };
    request(app)
      .post("/users/authenticate")
      .send(data)
      .expect(200, done);
  });

  it("respond with 422 malformed, because of no input", function(done) {
    request(app)
      .post("/users/authenticate")
      .expect(
        422,
        {
          Error: "Validation Error",
          message: [
            {
              username: "Not Allowed to be empty.",
            },
            {
              username: "Has to exist.",
            },
            {
              password: "Not Allowed to be empty.",
            },
            {
              password: "Has to exist.",
            },
            {
              password:
                "Too short or too long, needs atleast 8 characters and not more then 25.",
            },
          ],
        },
        done,
      );
  });

  it("respond with 422 ok, because of no password given", function(done) {
    let data = {
      username: "User",
    };
    request(app)
      .post("/users/authenticate")
      .send(data)
      .expect(
        422,
        {
          Error: "Validation Error",
          message: [
            {
              password: "Not Allowed to be empty.",
            },
            {
              password: "Has to exist.",
            },
            {
              password:
                "Too short or too long, needs atleast 8 characters and not more then 25.",
            },
          ],
        },
        done,
      );
  });
  it("respond with 422 ok, because of no username given", function(done) {
    let data = {
      password: "123456789",
    };
    request(app)
      .post("/users/authenticate")
      .send(data)
      .expect(
        422,
        {
          Error: "Validation Error",
          message: [
            {
              username: "Not Allowed to be empty.",
            },
            {
              username: "Has to exist.",
            },
          ],
        },
        done,
      );
  });
  it("respond with 422 malformed, because of too short password", function(done) {
    let data = {
      username: "User",
      password: "123456",
    };
    request(app)
      .post("/users/authenticate")
      .send(data)
      .expect(
        422,
        {
          Error: "Validation Error",
          message: [
            {
              password:
                "Too short or too long, needs atleast 8 characters and not more then 25.",
            },
          ],
        },
        done,
      );
  });
  it("respond with 422 malformed, because of too long password", function(done) {
    let data = {
      username: "User",
      password:
        "123456159198464fdeasf48es64fgsed86fg4ews6f84sed8f4se64f86es",
    };
    request(app)
      .post("/users/authenticate")
      .send(data)
      .expect(
        422,
        {
          Error: "Validation Error",
          message: [
            {
              password:
                "Too short or too long, needs atleast 8 characters and not more then 25.",
            },
          ],
        },
        done,
      );
  });
  it("respond with 422 malformed, because of too long username", function(done) {
    let data = {
      username:
        "Usefwefwefgwefjuiwenfiuoawefnbzuiaeowhfiewzqghfrzuoagwerofzugewaqzurwaezuir",
      password: "123456789",
    };
    request(app)
      .post("/users/authenticate")
      .send(data)
      .expect(
        422,
        {
          Error: "Validation Error",
          message: [
            {
              username: "Too long, not more then 25 characters.",
            },
          ],
        },
        done,
      );
  });
});
