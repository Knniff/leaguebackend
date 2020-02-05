require("dotenv").config();
const request = require("supertest");
const app = require("../server");

describe("GET /users", function() {
  var adminToken = null;
  var userToken = null;
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
      });
    await request(app)
      .post("/users/authenticate")
      .send(user)
      .then(response => {
        userToken = response.body.token;
      });
  });

  /*
   *
   *   Testing: Get all with admin-token
   *   statusCode: 200
   *
   */
  it("respond with 200 ok, because of correct token and role", function(done) {
    request(app)
      .get("/users")
      .set("Authorization", "Bearer " + adminToken)
      .expect(200, done);
  });
  /*
   *
   *   Testing: Get all with user-token
   *   statusCode: 401
   *
   */
  it("respond with 401 unauthorized, because of correct token but wrong role", function(done) {
    request(app)
      .get("/users")
      .set("Authorization", "Bearer " + userToken)
      .expect(
        401,
        {
          Error: "Unauthorized",
          message:
            "You dont have a role with the required Permissions for this.",
        },
        done,
      );
  });
  /*
   *
   *   Testing: Get all without auth header
   *   statusCode: 422
   *
   */
  it("respond with 422 unauthorized, because of missing token", function(done) {
    request(app)
      .get("/users")
      .expect(
        422,
        {
          Error: "Validation Error",
          message: [
            {
              authorization: "Not Allowed to be empty.",
            },
            {
              authorization: "Has to exist.",
            },
            {
              authorization: "Too short for a JWT.",
            },
          ],
        },
        done,
      );
  });
  /*
   *
   *   Testing: Get all with only Bearer
   *   statusCode: 422
   *
   */
  it("respond with 422 unauthorized, because of Bearer ", function(done) {
    request(app)
      .get("/users")
      .set("Authorization", "Bearer ")
      .expect(
        422,
        {
          Error: "Validation Error",
          message: [
            {
              authorization: "Too short for a JWT.",
            },
          ],
        },
        done,
      );
  });
  /*
   *
   *   Testing: Get all without token
   *   statusCode: 422
   *
   */
  it("respond with 422 unauthorized, because of malformed token", function(done) {
    request(app)
      .get("/users")
      .set(
        "Authorization",
        "Bearer 1f56ew1afg68qerw1gf98erqw1gf98qer1g89qer1f89qeds1fg89qwer1fg98qwe1f89qw",
      )
      .expect(
        422,
        {
          Error: "Unauthorized.",
          message: "JWT malformed.",
        },
        done,
      );
  });
});
