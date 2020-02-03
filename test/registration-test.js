require("dotenv").config();
const request = require("supertest");
const app = require("../server");

describe("POST /users/register", function() {
  /*
   *
   *   Testing: Correct Input
   *   statusCode: 200
   *
   */
  it("respond with 200 ok, because of correct input", function(done) {
    let data = {
      username: "CreationTest",
      password: "123456789",
      firstName: "Max",
      lastName: "Mustermann",
    };
    request(app)
      .post("/users/register")
      .send(data)
      .expect(200, {}, done);
  });
  /*
   *
   *   Testing: correct input but username already exists
   *   statusCode: 500
   *
   */
  it("respond with 500 internal server error, because of already existing username", function(done) {
    let data = {
      username: "User",
      password: "123456789",
      firstName: "Max",
      lastName: "Mustermann",
    };
    request(app)
      .post("/users/register")
      .send(data)
      .expect(
        500,
        {
          Error: "Not Unique",
          message: "Username User is already taken",
        },
        done,
      );
  });
  /*
   *
   *   Testing: no input
   *   statusCode: 422
   *
   */
  it("respond with 422 malformed, because of no input", function(done) {
    request(app)
      .post("/users/register")
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
              password:
                "Too short or too long, needs atleast 8 characters and not more then 25.",
            },
            {
              password: "Has to exist.",
            },
            {
              firstName: "Not Allowed to be empty.",
            },
            {
              firstName: "Has to exist.",
            },
            {
              lastName: "Not Allowed to be empty.",
            },
            {
              lastName: "Has to exist.",
            },
          ],
        },
        done,
      );
  });
  /*
   *
   *   Testing: password too short
   *   statusCode: 422
   *
   */
  it("respond with 422 malformed, because of too short password", function(done) {
    let data = {
      username: "CreationTest",
      password: "1234",
      firstName: "Max",
      lastName: "Mustermann",
    };
    request(app)
      .post("/users/register")
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
  /*
   *
   *   Testing: password too long
   *   statusCode: 422
   *
   */
  it("respond with 422 malformed, because of too long password", function(done) {
    let data = {
      username: "CreationTest",
      password:
        "1234567891561f89e6w1f896we1f98we61f9856we1f89w1e569f189we1f896w5e18fw1e6584f",
      firstName: "Max",
      lastName: "Mustermann",
    };
    request(app)
      .post("/users/register")
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
  /*
   *
   *   Testing: password missing
   *   statusCode: 422
   *
   */
  it("respond with 422 malformed, because of a missing password", function(done) {
    let data = {
      username: "CreationTest",
      password: "",
      firstName: "Max",
      lastName: "Mustermann",
    };
    request(app)
      .post("/users/register")
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
  /*
   *
   *   Testing: username too long
   *   statusCode: 422
   *
   */
  it("respond with 422 malformed, because of too long username", function(done) {
    let data = {
      username:
        "CreationTestvger4g89561er6584g98aerg1g1aer65g1ae91ga85e9r6w",
      password: "123456789",
      firstName: "Max",
      lastName: "Mustermann",
    };
    request(app)
      .post("/users/register")
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
  /*
   *
   *   Testing: username missing
   *   statusCode: 422
   *
   */
  it("respond with 422 malformed, because of missing username", function(done) {
    let data = {
      username: "",
      password: "123456789",
      firstName: "Max",
      lastName: "Mustermann",
    };
    request(app)
      .post("/users/register")
      .send(data)
      .expect(
        422,
        {
          Error: "Validation Error",
          message: [
            {
              username: "Not Allowed to be empty.",
            },
          ],
        },
        done,
      );
  });
  /*
   *
   *   Testing: firstName too long
   *   statusCode: 422
   *
   */
  it("respond with 422 malformed, because of too long firstName", function(done) {
    let data = {
      username: "CreationTest",
      password: "123456789",
      firstName:
        "Maxgf1re64754g1685sr4e1g61areg691rea6g1fg1a6wer1gf86aw1egf96aw81egf65aerae861g",
      lastName: "Mustermann",
    };
    request(app)
      .post("/users/register")
      .send(data)
      .expect(
        422,
        {
          Error: "Validation Error",
          message: [
            {
              firstName: "Too long, not more then 25 characters.",
            },
          ],
        },
        done,
      );
  });
  /*
   *
   *   Testing: firstName missing
   *   statusCode: 422
   *
   */
  it("respond with 422 malformed, because of missing firstName", function(done) {
    let data = {
      username: "CreationTest",
      password: "123456789",
      firstName: "",
      lastName: "Mustermann",
    };
    request(app)
      .post("/users/register")
      .send(data)
      .expect(
        422,
        {
          Error: "Validation Error",
          message: [
            {
              firstName: "Not Allowed to be empty.",
            },
          ],
        },
        done,
      );
  });
  /*
   *
   *   Testing: lastName too long
   *   statusCode: 422
   *
   */
  it("respond with 422 malformed, because of missing lastName", function(done) {
    let data = {
      username: "CreationTest",
      password: "123456789",
      firstName: "Max",
      lastName:
        "Mustermanngre1869g51er68sag16era81g6a1er86g1ae8r6g186eraw4g18ae6rg1ae6r8g1ae86",
    };
    request(app)
      .post("/users/register")
      .send(data)
      .expect(
        422,
        {
          Error: "Validation Error",
          message: [
            {
              lastName: "Too long, not more then 25 characters.",
            },
          ],
        },
        done,
      );
  });
  /*
   *
   *   Testing: lastName missing
   *   statusCode: 422
   *
   */
  it("respond with 422 malformed, because of missing lastName", function(done) {
    let data = {
      username: "CreationTest",
      password: "123456789",
      firstName: "Max",
      lastName: "",
    };
    request(app)
      .post("/users/register")
      .send(data)
      .expect(
        422,
        {
          Error: "Validation Error",
          message: [
            {
              lastName: "Not Allowed to be empty.",
            },
          ],
        },
        done,
      );
  });
});
