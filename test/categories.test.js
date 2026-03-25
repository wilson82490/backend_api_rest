

import { expect } from "chai";
import request from "supertest";
import app from "../app.js";
import Category from "../models/Category.js";

describe("Categories endpoint", function() {

    beforeEach (async function () {
        
        await Category.deleteMany({});
    
        await Category.create({
            name: "Electronics",
            });
    });


    it("should return all categories with a 200 status and an array", async function() {
        const response = await request(app).get("/categories");
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an("array");
        expect(response.body.length).to.equal(1);
    });

        it("should return name of first category ", async function() {
        const response = await request(app).get("/categories");
       
        expect(response.body[0]).to.have.property("name");
    });

    it("should create a new category and return it with a 201 status", async function() {
    const newCategory = {
        name: "Books",
        description: "All kinds of books"
    };
    const response = await request(app)
        .post("/categories").send(newCategory);


    expect(response.status).to.equal(201);
    expect(response.body).to.have.property("name");
    expect(response.body.name).to.equal("Books");
});
    it("should return category by ID ", async function() {
  const category = await Category.findOne({ name: "Electronics" });
  
  const response = await request(app).get(`/categories/${category.id}`);
  expect(response.status).to.equal(200);
  expect(response.body).to.have.property("name");
  expect(response.body.name).to.equal("Electronics");

  
 });

it ("should show one category by ID", async function() {
      const category = await Category.findOne({ name: "Electronics" });

    const response = await request(app).get(`/categories/${category.id}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("name");
    expect(response.body.name).to.equal("Electronics");
 });

it( "should return 422 if name category is missing", async function() {
   const res = await request(app).post("/categories").send({});
   expect(res.status).to.equal(422);
});


it( "should return error 400 category if id is invalid", async function() {
    const res = await request(app).get("/categories/123");
    expect(res.status).to.equal(400);
});


it("should return error 404 if category not found", async function() {
  const nonExistentId = "64a1f0c2e1b2c3d4e5f67890"; 
  const response = await request(app).get(`/categories/${nonExistentId}`);
  expect(response.status).to.equal(404);
});

it("should update category", async function (){
  const category = await Category.findOne({ name: "Electronics" });

  const updateCategory = {
    name: "Accessories",
   
  };

  const response = await request(app)
    .put(`/categories/${category.id}`)
    .send(updateCategory);

  expect(response.status).to.equal(200);
  expect(response.body).to.have.property("name");
  expect(response.body.name).to.equal("Accessories");

});

it("should delete one category", async function() {
  const category = await Category.findOne();

  const response = await request(app)
    .delete(`/categories/${category.id}`);

  expect(response.status).to.equal(204);
  

});

});