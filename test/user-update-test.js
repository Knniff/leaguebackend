require("dotenv").config();
const request = require("supertest");
const app = require("../server");

describe("PUT /users/", function() {
  var adminToken = null;
  var userToken = null;
  var adminId = null;
  var userId = null;
  beforeEach(async function() {
    const user = {
      username: "User",
      password: "123456789",
    };
    const admin = {
      username: "Admin",
      password: "123456789",
    };
    await request(app)
      .post("/users/authenticate")
      .send(admin)
      .then(response => {
        adminToken = response.body.token;
        adminId = response.body._id;
      });
    await request(app)
      .post("/users/authenticate")
      .send(user)
      .then(response => {
        userToken = response.body.token;
        userId = response.body._id;
      });
  });

  /*
   *
   *   Testing: user updating his Username
   *   statusCode: 200
   *
   */
  it("respond with 200 ok, because of correct input and unique username", function(done) {
    const user = {
      username: "User1",
      password: "123456789",
      firstName: "Max",
      lastName: "Mustermann",
    };
    request(app)
      .put("/users/" + userId)
      .set("Authorization", "Bearer " + userToken)
      .send(user)
      .expect(200, done);
  });
  /*
   *
   *   Testing: user updating his firstname
   *   statusCode: 200
   *
   */
  it("respond with 200 ok, because of correct input and the same username", function(done) {
    const user = {
      username: "User",
      password: "123456789",
      firstName: "Peter",
      lastName: "Mustermann",
    };
    request(app)
      .put("/users/" + userId)
      .set("Authorization", "Bearer " + userToken)
      .send(user)
      .expect(200, done);
  });
  /*
   *
   *   Testing: user updating himself with an already existing username
   *   statusCode:
   *
   */
  it("respond with 500 forbidden, because the username already exists", function(done) {
    const user = {
      username: "Admin",
      password: "123456789",
      firstName: "Max",
      lastName: "Mustermann",
    };
    request(app)
      .put("/users/" + userId)
      .set("Authorization", "Bearer " + userToken)
      .send(user)
      .expect(
        500,
        {
          Error: "Not Unique",
          message: "Username Admin is already taken",
        },
        done,
      );
  });
  /*
   *
   *   Testing: user updating another user
   *   statusCode:
   *
   */
  it("respond with 403 forbidden, because a standard user cant update other users", function(done) {
    const user = {
      username: "Admin",
      password: "123456789",
      firstName: "Max",
      lastName: "Mustermann",
    };
    request(app)
      .put("/users/" + adminId)
      .set("Authorization", "Bearer " + userToken)
      .send(user)
      .expect(
        403,
        {
          Error: "Forbidden",
          message:
            "Forbidden for standard User, if its not your own account.",
        },
        done,
      );
  });
  /*
   *
   *   Testing: admin updating users firstname
   *   statusCode: 200
   *
   */
  it("respond with 200 ok, because of correct input and the same username and admin can update all", function(done) {
    const user = {
      username: "User",
      password: "123456789",
      firstName: "Peter",
      lastName: "Mustermann",
    };
    request(app)
      .put("/users/" + userId)
      .set("Authorization", "Bearer " + adminToken)
      .send(user)
      .expect(200, done);
  });
  /*
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   */
  /*
   *
   *   Testing: no input
   *   statusCode: 422
   *
   */
  it("respond with 422 malformed, because of no input", function(done) {
    request(app)
      .put("/users/" + userId)
      .set("Authorization", "Bearer " + userToken)
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
      .put("/users/" + userId)
      .set("Authorization", "Bearer " + userToken)
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
      .put("/users/" + userId)
      .set("Authorization", "Bearer " + userToken)
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
      .put("/users/" + userId)
      .set("Authorization", "Bearer " + userToken)
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
      .put("/users/" + userId)
      .set("Authorization", "Bearer " + userToken)
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
      .put("/users/" + userId)
      .set("Authorization", "Bearer " + userToken)
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
      .put("/users/" + userId)
      .set("Authorization", "Bearer " + userToken)
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
      .put("/users/" + userId)
      .set("Authorization", "Bearer " + userToken)
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
      .put("/users/" + userId)
      .set("Authorization", "Bearer " + userToken)
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
      .put("/users/" + userId)
      .set("Authorization", "Bearer " + userToken)
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
