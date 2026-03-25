

/* import { expect } from "chai";
import request from "supertest";
import app from "../app.js";

import User from "../models/User.js";

describe("Auth User", function()  {

   this.beforeEach(async () => {
      await User.deleteMany({});
   });


    it("should register a new user", async function () {
        const res = await request(app)
        .post("/auth/register")
        .send({
            email: "new.user@example.com",
            password: "123456"
        });
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property("id");
        expect(res.body).to.have.property("email", "new.user@example.com");
    });




it("should login a user and return a token", async function () {
    await User.create({
        email: "new.user@example.com",
        password: "123456"
    });
    const res = await request(app)
        .post("/auth/login")
        .send({
            email: "new.user@example.com",
            password: "123456"
        });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("token");

});
});
 */
/* import { expect } from "chai";
import request from "supertest";
import app from "../app.js";
import User from "../models/User.js";

describe("Auth User", function () {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    it("should register a new user", async function () {
        const res = await request(app)
            .post("/auth/register")
            .send({
                email: "new.user@example.com",
                password: "123456"
            });

        expect(res.status).to.equal(201);
        expect(res.body).to.have.property("id");
        expect(res.body).to.have.property("email", "new.user@example.com");
    });

    it("should login a user and return a token", async function () {
        await request(app)
            .post("/auth/register")
            .send({
                email: "new.user@example.com",
                password: "123456"
            });

        const res = await request(app)
            .post("/auth/login")
            .send({
                email: "new.user@example.com",
                password: "123456"
            });

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("token");
    });
}); */

import { expect } from "chai";
import request from "supertest";
import app from "../app.js";

import bcrypt from "bcryptjs";

import User from "../models/User.js";

describe("Auth User", function () {
  this.timeout(5000);

  beforeEach(async () => {
    await User.deleteMany({});

    const hash = await bcrypt.hash("123456", 10);

    await User.create({
      email: "test@example.com",
      password: hash,
    });
  });

  it("Should register a new user", async function () {
    const res = await request(app).post("/auth/register").send({
      email: "new.user@example.com",
      password: "123456",
    });

    expect(res.status).to.equal(201);
  });

  it("Should be able to obtain a token", async function () {
    const res = await request(app).post("/auth/login").send({
      email: "test@example.com",
      password: "123456",
    });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("token");
  });

  it("should send 401 if no token is provided", async function () {
    const res = await request(app).get("/auth/profile");

    expect(res.status).to.equal(401);
  });

  it ("should return user profile with valid token", async function () {
    const login = await request(app).post("/auth/login").send({
      email: "test@example.com",
      password: "123456",
    });

    const token = login.body.token;

    const res = await request(app)
      .get("/auth/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("user");
    expect(res.body.user).to.have.property("email", "test@example.com");
  });
});