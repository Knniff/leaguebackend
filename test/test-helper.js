require("dotenv").config();
const request = require("supertest");
const app = require("../server");
const dropDB = require("../_helpers/db").dropDB;
const userService = require("../users/user.service");

beforeEach(async function() {
  const user = {
    username: "User",
    password: "123456789",
    firstName: "Max",
    lastName: "Mustermann",
  };
  const admin = {
    username: "Admin",
    password: "123456789",
    firstName: "Maxim",
    lastName: "Markow",
    role: "Admin",
  };
  await dropDB();
  await userService.create(user).catch(console.log("already exists"));
  await userService
    .create(admin)
    .catch(console.log("already exists"));
});

// https://stackoverflow.com/questions/26453990/super-test-test-secure-rest-api
// https://hackernoon.com/api-testing-using-supertest-1f830ce838f1
