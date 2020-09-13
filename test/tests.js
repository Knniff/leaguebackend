/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
/* eslint-disable func-names */
require("dotenv").config();
const request = require("supertest");
const bcrypt = require("bcryptjs");
const Role = require("../_helpers/role");
const { dropDB, closeConnection, User } = require("../_helpers/db");
const app = require("../server");
const { generateTOTP } = require("../_helpers/mfa");

const userLoginData = {
  username: "User",
  password: "123456789",
};
const adminLoginData = {
  username: "Admin",
  password: "123456789",
};
async function createUser() {
  const userParam = {
    username: "User",
    password: "123456789",
    firstName: "Max",
    lastName: "Mustermann",
    role: JSON.stringify(Role.User),
  };
  const user = new User(userParam);

  user.hash = bcrypt.hashSync(userParam.password, 10);

  await user.save();
  console.log("User saved!");
}

async function createAdmin() {
  const userParam = {
    username: "Admin",
    password: "123456789",
    firstName: "Maxim",
    lastName: "Markow",
    role: JSON.stringify(Role.Admin),
  };
  const user = new User(userParam);

  user.hash = bcrypt.hashSync(userParam.password, 10);

  await user.save();
  console.log("Admin saved!");
}

async function login(user) {
  return request(app).post("/users/login").send(user);
}

describe("/users", function () {
  afterEach(async function () {
    await dropDB();
  });

  before(async function () {
    await dropDB();
  });
  after(async function () {
    app.close();
    await closeConnection();
  });
  describe("POST /refresh", function () {
    describe("Successes", function () {
      it("respond with 200 ok, because of valid refreshToken", async function () {
        await createUser();
        const user = await login(userLoginData);
        const data = {
          refreshToken: user.body.refreshToken,
        };
        await request(app)
          .post("/users/refresh")
          .send(data)
          .expect(200);
      });
    });
    describe("Errors", function () {
      it("respond with 401 Unauthorized, because of invalid refreshToken either because its malformed or logged out", async function () {
        const data = {
          refreshToken:
            "00000000000000000iIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZjQ2Nzg3MDY3YjhlMzE2YjVmMjc5ZmEiLCJyb2xlIjoie1wibmFtZVwiOlwiVXNlclwiLFwicmFua1wiOlwiMVwifSIsImlhdCI6MTU5ODQ1Mzg3N30.gPLtiP590kdbYfb267Zc3Gm7z5oDfNcuSS0XI9rJSH",
        };
        await request(app)
          .post("/users/refresh")
          .send(data)
          .expect(401, {
            Error: "Unauthorized",
            message: "The refresh token is invalid.",
          });
      });
      it("respond with 422 Unprocessable Entity, because of no refreshToken", async function () {
        const data = {
          refreshToken: "",
        };
        await request(app)
          .post("/users/refresh")
          .send(data)
          .expect(422, {
            Error: "Validation Error",
            message: [
              {
                refreshToken: "Not Allowed to be empty.",
              },
              {
                refreshToken: "Too short for a JWT.",
              },
            ],
          });
      });
    });
  });
  describe("POST /mfa", function () {
    describe("Successes", function () {
      it("respond with 200 ok, because mfa got activated", async function () {
        await createUser();
        const user = await login(userLoginData);
        const generateSecret = await request(app)
          .post("/users/mfa/generate")
          .set("Authorization", `Bearer ${user.body.accessToken}`);
        const totp = generateTOTP(generateSecret.body.userSecret, 0);
        await request(app)
          .post("/users/mfa/enable")
          .set("Authorization", `Bearer ${user.body.accessToken}`)
          .send({ token: totp })
          .expect(200);
      });
      it("respond with 200 ok, because mfa got deactivated", async function () {
        await createUser();
        const user = await login(userLoginData);
        const generateSecret = await request(app)
          .post("/users/mfa/generate")
          .set("Authorization", `Bearer ${user.body.accessToken}`);
        const totp = generateTOTP(generateSecret.body.userSecret, 0);
        await request(app)
          .post("/users/mfa/enable")
          .set("Authorization", `Bearer ${user.body.accessToken}`)
          .send({ token: totp });
        await request(app)
          .post("/users/mfa/disable")
          .set("Authorization", `Bearer ${user.body.accessToken}`)
          .send({ token: totp })
          .expect(200);
      });
      it("respond with 200 ok, because mfa got activated and used", async function () {
        await createUser();
        const user = await login(userLoginData);
        const generateSecret = await request(app)
          .post("/users/mfa/generate")
          .set("Authorization", `Bearer ${user.body.accessToken}`);
        const totp = generateTOTP(generateSecret.body.userSecret, 0);
        await request(app)
          .post("/users/mfa/enable")
          .set("Authorization", `Bearer ${user.body.accessToken}`)
          .send({ token: totp });
        await request(app)
          .post("/users/logout")
          .send({ refreshToken: user.body.refreshToken });
        const loginResponse = await login(userLoginData);
        await request(app)
          .post("/users/mfa/verify")
          .send({
            refreshToken: loginResponse.body.refreshToken,
            totp,
          })
          .expect(200);
      });
    });
    describe("Errors", function () {
      it("respond with 401 unauthorized, because totp wrong", async function () {
        await createUser();
        const user = await login(userLoginData);
        await request(app)
          .post("/users/mfa/generate")
          .set("Authorization", `Bearer ${user.body.accessToken}`);
        await request(app)
          .post("/users/mfa/enable")
          .set("Authorization", `Bearer ${user.body.accessToken}`)
          .send({ token: "000000" })
          .expect(401, {
            Error: "Unauthorized",
            message:
              "TOTP Token is incorrect. Mfa Activation process exited.",
          });
      });
      it("respond with 401 Unauthorized, because mfa got activated and used but wrong totp", async function () {
        await createUser();
        const user = await login(userLoginData);
        const generateSecret = await request(app)
          .post("/users/mfa/generate")
          .set("Authorization", `Bearer ${user.body.accessToken}`);
        const generatedTotp = generateTOTP(
          generateSecret.body.userSecret,
          0,
        );
        await request(app)
          .post("/users/mfa/enable")
          .set("Authorization", `Bearer ${user.body.accessToken}`)
          .send({ token: generatedTotp });
        await request(app)
          .post("/users/logout")
          .send({ refreshToken: user.body.refreshToken });
        const loginResponse = await login(userLoginData);
        await request(app)
          .post("/users/mfa/verify")
          .send({
            refreshToken: loginResponse.body.refreshToken,
            totp: "A00000",
          })
          .expect(401);
      });
    });
  });
  describe("POST /register", function () {
    describe("Successes", function () {
      it("respond with 200 ok, because of correct input", async function () {
        const data = {
          username: "CreationTest",
          password: "123456789",
          firstName: "Max",
          lastName: "Mustermann",
        };
        await request(app)
          .post("/users/register")
          .send(data)
          .expect(200);
      });
    });
    describe("Errors", function () {
      it("respond with 500 internal server error, because of already existing username", async function () {
        const data = {
          username: "User",
          password: "123456789",
          firstName: "Max",
          lastName: "Mustermann",
        };
        await createUser();
        await request(app)
          .post("/users/register")
          .send(data)
          .expect(500, {
            Error: "Not Unique",
            message: "Username User is already taken",
          });
      });
      it("respond with 422 malformed, because a role was supplied but is not allowed", async function () {
        const data = {
          username: "User",
          password: "123456789",
          firstName: "Max",
          lastName: "Mustermann",
          role: "something",
        };
        await request(app)
          .post("/users/register")
          .send(data)
          .expect(422, {
            Error: "Validation Error",
            message: [
              {
                role: "Invalid value",
              },
            ],
          });
      });
      it("respond with 422 malformed, because of no input", async function () {
        await request(app)
          .post("/users/register")
          .expect(422, {
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
          });
      });
      it("respond with 422 malformed, because of too short password", async function () {
        const data = {
          username: "CreationTest",
          password: "1234",
          firstName: "Max",
          lastName: "Mustermann",
        };
        await request(app)
          .post("/users/register")
          .send(data)
          .expect(422, {
            Error: "Validation Error",
            message: [
              {
                password:
                  "Too short or too long, needs atleast 8 characters and not more then 25.",
              },
            ],
          });
      });
      it("respond with 422 malformed, because of too long password", async function () {
        const data = {
          username: "CreationTest",
          password:
            "1234567891561f89e6w1f896we1f98we61f9856we1f89w1e569f189we1f896w5e18fw1e6584f",
          firstName: "Max",
          lastName: "Mustermann",
        };
        await request(app)
          .post("/users/register")
          .send(data)
          .expect(422, {
            Error: "Validation Error",
            message: [
              {
                password:
                  "Too short or too long, needs atleast 8 characters and not more then 25.",
              },
            ],
          });
      });
      it("respond with 422 malformed, because of a missing password", async function () {
        const data = {
          username: "CreationTest",
          password: "",
          firstName: "Max",
          lastName: "Mustermann",
        };
        await request(app)
          .post("/users/register")
          .send(data)
          .expect(422, {
            Error: "Validation Error",
            message: [
              {
                password:
                  "Too short or too long, needs atleast 8 characters and not more then 25.",
              },
            ],
          });
      });
      it("respond with 422 malformed, because of too long username", async function () {
        const data = {
          username:
            "CreationTestvger4g89561er6584g98aerg1g1aer65g1ae91ga85e9r6w",
          password: "123456789",
          firstName: "Max",
          lastName: "Mustermann",
        };
        await request(app)
          .post("/users/register")
          .send(data)
          .expect(422, {
            Error: "Validation Error",
            message: [
              {
                username: "Too long, not more then 25 characters.",
              },
            ],
          });
      });
      it("respond with 422 malformed, because of missing username", async function () {
        const data = {
          username: "",
          password: "123456789",
          firstName: "Max",
          lastName: "Mustermann",
        };
        await request(app)
          .post("/users/register")
          .send(data)
          .expect(422, {
            Error: "Validation Error",
            message: [
              {
                username: "Not Allowed to be empty.",
              },
            ],
          });
      });
      it("respond with 422 malformed, because of too long firstName", async function () {
        const data = {
          username: "CreationTest",
          password: "123456789",
          firstName:
            "Maxgf1re64754g1685sr4e1g61areg691rea6g1fg1a6wer1gf86aw1egf96aw81egf65aerae861g",
          lastName: "Mustermann",
        };
        await request(app)
          .post("/users/register")
          .send(data)
          .expect(422, {
            Error: "Validation Error",
            message: [
              {
                firstName: "Too long, not more then 25 characters.",
              },
            ],
          });
      });
      it("respond with 422 malformed, because of missing firstName", async function () {
        const data = {
          username: "CreationTest",
          password: "123456789",
          firstName: "",
          lastName: "Mustermann",
        };
        await request(app)
          .post("/users/register")
          .send(data)
          .expect(422, {
            Error: "Validation Error",
            message: [
              {
                firstName: "Not Allowed to be empty.",
              },
            ],
          });
      });
      it("respond with 422 malformed, because of too long lastName", async function () {
        const data = {
          username: "CreationTest",
          password: "123456789",
          firstName: "Max",
          lastName:
            "Mustermanngre1869g51er68sag16era81g6a1er86g1ae8r6g186eraw4g18ae6rg1ae6r8g1ae86",
        };
        await request(app)
          .post("/users/register")
          .send(data)
          .expect(422, {
            Error: "Validation Error",
            message: [
              {
                lastName: "Too long, not more then 25 characters.",
              },
            ],
          });
      });
      it("respond with 422 malformed, because of missing lastName", async function () {
        const data = {
          username: "CreationTest",
          password: "123456789",
          firstName: "Max",
          lastName: "",
        };
        await request(app)
          .post("/users/register")
          .send(data)
          .expect(422, {
            Error: "Validation Error",
            message: [
              {
                lastName: "Not Allowed to be empty.",
              },
            ],
          });
      });
    });
  });
  describe("UPDATE /", function () {
    describe("Successes", function () {
      it("respond with 200 ok, because of correct input and unique username", async function () {
        const updates = {
          username: "User1",
          password: "123456789",
          firstName: "Max",
          lastName: "Mustermann",
        };
        await createUser();
        const user = await login(userLoginData);
        await request(app)
          .put(`/users/${user.body._id}`)
          .set("Authorization", `Bearer ${user.body.accessToken}`)
          .send(updates)
          .expect(200);
      });
      it("respond with 200 ok, because of correct input and the same username", async function () {
        const updates = {
          username: "User",
          password: "123456789",
          firstName: "Peter",
          lastName: "Mustermann",
        };
        await createUser();
        const user = await login(userLoginData);
        await request(app)
          .put(`/users/${user.body._id}`)
          .set("Authorization", `Bearer ${user.body.accessToken}`)
          .send(updates)
          .expect(200);
      });
      it("respond with 200 ok, because of correct input and the same username and admin can update all", async function () {
        const updates = {
          username: "User",
          password: "123456789",
          firstName: "Peter",
          lastName: "Mustermann",
        };
        await createAdmin();
        await createUser();
        const user = await login(userLoginData);
        const admin = await login(adminLoginData);
        await request(app)
          .put(`/users/${user.body._id}`)
          .set("Authorization", `Bearer ${admin.body.accessToken}`)
          .send(updates)
          .expect(200);
      });
    });
    describe("Errors", function () {
      it("respond with 500 forbidden, because the username already exists", async function () {
        const updates = {
          username: "Admin",
          password: "123456789",
          firstName: "Max",
          lastName: "Mustermann",
        };
        await createAdmin();
        await createUser();
        const user = await login(userLoginData);
        await request(app)
          .put(`/users/${user.body._id}`)
          .set("Authorization", `Bearer ${user.body.accessToken}`)
          .send(updates)
          .expect(500, {
            Error: "Not Unique",
            message: "Username Admin is already taken",
          });
      });
      it("respond with 403 forbidden, because a standard user cant update other users", async function () {
        const updates = {
          username: "Admin",
          password: "123456789",
          firstName: "Max",
          lastName: "Mustermann",
        };
        await createAdmin();
        await createUser();
        const user = await login(userLoginData);
        const admin = await login(adminLoginData);
        await request(app)
          .put(`/users/${admin.body._id}`)
          .set("Authorization", `Bearer ${user.body.accessToken}`)
          .send(updates)
          .expect(403, {
            Error: "Forbidden",
            message:
              "Forbidden for your rank, if its not your own account.",
          });
      });
      it("respond with 422 malformed, because of no input", async function () {
        await createUser();
        const user = await login(userLoginData);
        await request(app)
          .put(`/users/${user.body._id}`)
          .set("Authorization", `Bearer ${user.body.accessToken}`)
          .expect(422, {
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
          });
      });
      it("respond with 422 malformed, because of too short password", async function () {
        const updates = {
          username: "CreationTest",
          password: "1234",
          firstName: "Max",
          lastName: "Mustermann",
        };
        await createUser();
        const user = await login(userLoginData);
        await request(app)
          .put(`/users/${user.body._id}`)
          .set("Authorization", `Bearer ${user.body.accessToken}`)
          .send(updates)
          .expect(422, {
            Error: "Validation Error",
            message: [
              {
                password:
                  "Too short or too long, needs atleast 8 characters and not more then 25.",
              },
            ],
          });
      });
      it("respond with 422 malformed, because of too long password", async function () {
        const updates = {
          username: "CreationTest",
          password:
            "1234567891561f89e6w1f896we1f98we61f9856we1f89w1e569f189we1f896w5e18fw1e6584f",
          firstName: "Max",
          lastName: "Mustermann",
        };
        await createUser();
        const user = await login(userLoginData);
        await request(app)
          .put(`/users/${user.body._id}`)
          .set("Authorization", `Bearer ${user.body.accessToken}`)
          .send(updates)
          .expect(422, {
            Error: "Validation Error",
            message: [
              {
                password:
                  "Too short or too long, needs atleast 8 characters and not more then 25.",
              },
            ],
          });
      });
      it("respond with 422 malformed, because of a missing password", async function () {
        const updates = {
          username: "CreationTest",
          password: "",
          firstName: "Max",
          lastName: "Mustermann",
        };
        await createUser();
        const user = await login(userLoginData);
        await request(app)
          .put(`/users/${user.body._id}`)
          .set("Authorization", `Bearer ${user.body.accessToken}`)
          .send(updates)
          .expect(422, {
            Error: "Validation Error",
            message: [
              {
                password:
                  "Too short or too long, needs atleast 8 characters and not more then 25.",
              },
            ],
          });
      });
      it("respond with 422 malformed, because of too long username", async function () {
        const updates = {
          username:
            "CreationTestvger4g89561er6584g98aerg1g1aer65g1ae91ga85e9r6w",
          password: "123456789",
          firstName: "Max",
          lastName: "Mustermann",
        };
        await createUser();
        const user = await login(userLoginData);
        await request(app)
          .put(`/users/${user.body._id}`)
          .set("Authorization", `Bearer ${user.body.accessToken}`)
          .send(updates)
          .expect(422, {
            Error: "Validation Error",
            message: [
              {
                username: "Too long, not more then 25 characters.",
              },
            ],
          });
      });
      it("respond with 422 malformed, because of missing username", async function () {
        const updates = {
          username: "",
          password: "123456789",
          firstName: "Max",
          lastName: "Mustermann",
        };
        await createUser();
        const user = await login(userLoginData);
        await request(app)
          .put(`/users/${user.body._id}`)
          .set("Authorization", `Bearer ${user.body.accessToken}`)
          .send(updates)
          .expect(422, {
            Error: "Validation Error",
            message: [
              {
                username: "Not Allowed to be empty.",
              },
            ],
          });
      });
      it("respond with 422 malformed, because of too long firstName", async function () {
        const updates = {
          username: "CreationTest",
          password: "123456789",
          firstName:
            "Maxgf1re64754g1685sr4e1g61areg691rea6g1fg1a6wer1gf86aw1egf96aw81egf65aerae861g",
          lastName: "Mustermann",
        };
        await createUser();
        const user = await login(userLoginData);
        await request(app)
          .put(`/users/${user.body._id}`)
          .set("Authorization", `Bearer ${user.body.accessToken}`)
          .send(updates)
          .expect(422, {
            Error: "Validation Error",
            message: [
              {
                firstName: "Too long, not more then 25 characters.",
              },
            ],
          });
      });
      it("respond with 422 malformed, because of missing firstName", async function () {
        const updates = {
          username: "CreationTest",
          password: "123456789",
          firstName: "",
          lastName: "Mustermann",
        };
        await createUser();
        const user = await login(userLoginData);
        await request(app)
          .put(`/users/${user.body._id}`)
          .set("Authorization", `Bearer ${user.body.accessToken}`)
          .send(updates)
          .expect(422, {
            Error: "Validation Error",
            message: [
              {
                firstName: "Not Allowed to be empty.",
              },
            ],
          });
      });

      it("respond with 422 malformed, because of too long lastName", async function () {
        const updates = {
          username: "CreationTest",
          password: "123456789",
          firstName: "Max",
          lastName:
            "Mustermanngre1869g51er68sag16era81g6a1er86g1ae8r6g186eraw4g18ae6rg1ae6r8g1ae86",
        };
        await createUser();
        const user = await login(userLoginData);
        await request(app)
          .put(`/users/${user.body._id}`)
          .set("Authorization", `Bearer ${user.body.accessToken}`)
          .send(updates)
          .expect(422, {
            Error: "Validation Error",
            message: [
              {
                lastName: "Too long, not more then 25 characters.",
              },
            ],
          });
      });

      it("respond with 422 malformed, because of missing lastName", async function () {
        const updates = {
          username: "CreationTest",
          password: "123456789",
          firstName: "Max",
          lastName: "",
        };
        await createUser();
        const user = await login(userLoginData);
        await request(app)
          .put(`/users/${user.body._id}`)
          .set("Authorization", `Bearer ${user.body.accessToken}`)
          .send(updates)
          .expect(422, {
            Error: "Validation Error",
            message: [
              {
                lastName: "Not Allowed to be empty.",
              },
            ],
          });
      });
    });
  });
  describe("GET /", function () {
    describe("Successes", function () {
      it("respond with 200 ok, because admin can get himself", async function () {
        await createAdmin();
        const admin = await login(adminLoginData);
        await request(app)
          .get(`/users/${admin.body._id}`)
          .set("Authorization", `Bearer ${admin.body.accessToken}`)
          .expect(200);
      });
      it("respond with 200 ok, because user can get himself", async function () {
        await createUser();
        const user = await login(userLoginData);
        await request(app)
          .get(`/users/${user.body._id}`)
          .set("Authorization", `Bearer ${user.body.accessToken}`)
          .expect(200);
      });
      it("respond with 200 ok, because admins can get others", async function () {
        await createAdmin();
        await createUser();
        const user = await login(userLoginData);
        const admin = await login(adminLoginData);
        await request(app)
          .get(`/users/${user.body._id}`)
          .set("Authorization", `Bearer ${admin.body.accessToken}`)
          .expect(200);
      });

      it("respond with 200 ok, because of correct token and role", async function () {
        await createAdmin();
        const admin = await login(adminLoginData);
        await request(app)
          .get("/users")
          .set("Authorization", `Bearer ${admin.body.accessToken}`)
          .expect(200);
      });
    });
    describe("Errors", function () {
      it("respond with 401 unauthorized, because user cant get other users", async function () {
        await createAdmin();
        await createUser();
        const user = await login(userLoginData);
        const admin = await login(adminLoginData);
        await request(app)
          .get(`/users/${admin.body._id}`)
          .set("Authorization", `Bearer ${user.body.accessToken}`)
          .expect(403, {
            Error: "Forbidden",
            message:
              "Forbidden for your rank, if its not your own account.",
          });
      });
      it("respond with 401 unauthorized, because of correct token but wrong role", async function () {
        await createUser();
        const user = await login(userLoginData);
        await request(app)
          .get("/users")
          .set("Authorization", `Bearer ${user.body.accessToken}`)
          .expect(401, {
            Error: "Unauthorized",
            message:
              "You dont have a role with the required Permissions for this.",
          });
      });

      it("respond with 422 unauthorized, because of missing token", async function () {
        await request(app)
          .get("/users")
          .expect(422, {
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
          });
      });

      it("respond with 422 unauthorized, because of Bearer ", async function () {
        await request(app)
          .get("/users")
          .set("Authorization", "Bearer ")
          .expect(422, {
            Error: "Validation Error",
            message: [
              {
                authorization: "Too short for a JWT.",
              },
            ],
          });
      });

      it("respond with 401 unauthorized, because of malformed token", async function () {
        await request(app)
          .get("/users")
          .set(
            "Authorization",
            "Bearer 1f56ew1afg68qerw1gf98erqw1gf98qer1g89qer1f89qeds1fg89qwer1fg98qwe1f89qw",
          )
          .expect(401, {
            Error: "Unauthorized",
            message: "The token is invalid.",
          });
      });
    });
  });
  describe("DELETE /", function () {
    describe("Successes", function () {
      it("respond with 200 ok, because he is allowed to delete himself", async function () {
        await createUser();
        const user = await login(userLoginData);
        await request(app)
          .delete(`/users/${user.body._id}`)
          .set("Authorization", `Bearer ${user.body.accessToken}`)
          .expect(200);
      });
      it("respond with 200 ok, because admins are allowed to delete all users", async function () {
        await createAdmin();
        await createUser();
        const user = await login(userLoginData);
        const admin = await login(adminLoginData);
        await request(app)
          .delete(`/users/${user.body._id}`)
          .set("Authorization", `Bearer ${admin.body.accessToken}`)
          .expect(200);
      });
    });

    describe("Errors", function () {
      it("respond with 403 forbidden, because a standard user cant delete other users", async function () {
        await createUser();
        const responseBody = await login(userLoginData);
        await request(app)
          .delete("/users/0000000000006204aefc242c")
          .set(
            "Authorization",
            `Bearer ${responseBody.body.accessToken}`,
          )
          .expect(403, {
            Error: "Forbidden",
            message:
              "Forbidden for your rank, if its not your own account.",
          });
      });
    });
  });
  describe("POST /logout", function () {
    describe("Successes", function () {
      it("respond with 200 ok, because of valid refreshToken", async function () {
        await createUser();
        const user = await login(userLoginData);
        const refreshToken = {
          refreshToken: user.body.refreshToken,
        };
        await request(app)
          .post("/users/logout")
          .send(refreshToken)
          .expect(200);
      });
    });
    describe("Errors", function () {
      it("respond with 401 Unauthorized, because of invalid refreshToken", async function () {
        const data = {
          refreshToken:
            "1fe56w1f56we1f00000056a1w6f156awe1f56w1e6f1awe56f1aw51f6aw1f561aew65f165awe1f561ew56",
        };
        await request(app)
          .post("/users/logout")
          .send(data)
          .expect(401, {
            Error: "Unauthorized",
            message: "The refresh token is invalid.",
          });
      });
      it("respond with 422 Unprocessable Entity, because of no refreshToken", async function () {
        const data = {
          refreshToken: "",
        };
        await request(app)
          .post("/users/logout")
          .send(data)
          .expect(422, {
            Error: "Validation Error",
            message: [
              {
                refreshToken: "Not Allowed to be empty.",
              },
              {
                refreshToken: "Too short for a JWT.",
              },
            ],
          });
      });
    });
  });
  describe("POST /login", function () {
    describe("Successes", function () {
      it("respond with 200 ok, because of correct input", async function () {
        await createUser();
        await request(app)
          .post("/users/login")
          .send(userLoginData)
          .expect(200);
      });
    });
    describe("Errors", function () {
      it("respond with 401 Unauthorized, because of wrong password", async function () {
        const loginData = {
          username: "User",
          password: "1234563249",
        };
        await createUser();
        await request(app)
          .post("/users/login")
          .send(loginData)
          .expect(401, {
            Error: "Unauthorized",
            message: "Username or Password is incorrect.",
          });
      });
      it("respond with 422 malformed, because of no input", async function () {
        await request(app)
          .post("/users/login")
          .expect(422, {
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
          });
      });
      it("respond with 422 malformed, because of too short password", async function () {
        const loginData = {
          username: "User",
          password: "123456",
        };
        await request(app)
          .post("/users/login")
          .send(loginData)
          .expect(422, {
            Error: "Validation Error",
            message: [
              {
                password:
                  "Too short or too long, needs atleast 8 characters and not more then 25.",
              },
            ],
          });
      });
      it("respond with 422 malformed, because of too long password", async function () {
        const loginData = {
          username: "User",
          password:
            "123456159198464fdeasf48es64fgsed86fg4ews6f84sed8f4se64f86es",
        };
        await request(app)
          .post("/users/login")
          .send(loginData)
          .expect(422, {
            Error: "Validation Error",
            message: [
              {
                password:
                  "Too short or too long, needs atleast 8 characters and not more then 25.",
              },
            ],
          });
      });
      it("respond with 422 malformed, because of too long username", async function () {
        const loginData = {
          username:
            "Usefwefwefgwefjuiwenfiuoawefnbzuiaeowhfiewzqghfrzuoagwerofzugewaqzurwaezuir",
          password: "123456789",
        };
        await request(app)
          .post("/users/login")
          .send(loginData)
          .expect(422, {
            Error: "Validation Error",
            message: [
              {
                username: "Too long, not more then 25 characters.",
              },
            ],
          });
      });
    });
  });
});
