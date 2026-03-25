import { expect } from "chai";

import request from "supertest";
import app from "../app.js";
import bcrypt from "bcryptjs";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { updateProduct } from "../controllers/products-controller.js";

describe("Products endpoint", function() {

    this.timeout(5000);

   beforeEach (async function () {

    await User.deleteMany({});

    const hash = await bcrypt.hash("123456", 10);

    const user = await User.create({
      email: "test@example.com",
      password: hash
    });
    
    await Category.deleteMany({});

    const category = await Category.create({
        name: "Electronics",
        });
        
    await Product.deleteMany({});

    await Product.create({
      name: "Mouse",
      price: 80,
      stock: 10,
      category: category._id,
      owner: user._id
    })
   })

    it("should return all products with a 200 status and an array", async function() {
        const response = await request(app).get("/products");
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an("array");
        expect(response.body.length).to.equal(1);
    });


    it("should populate category name in the first product", async function() {
        const response = await request(app).get("/products");

        expect(response.status).to.equal(200);
        expect(response.body).to.be.an("array");
        expect(response.body.length).to.equal(1);

        expect(response.body[0]).to.have.property("category");
        expect(response.body[0].category).to.be.an("object");
        expect(response.body[0].category).to.have.property("name");
        expect(response.body[0].category.name).to.equal("Electronics");
    });

    it("should return name products ", async function() {
        const response = await request(app).get("/products");
        
        expect(response.body[0]).to.have.property("name");
    });

   it("should create a new product", async function() {
   // Primero, hacemos login para obtener el token de autenticación
  const login = await request(app)
    .post("/auth/login")
    .send({ email: "test@example.com", 
      password: "123456" 
    });

    //console.log(login.body.token, login.status);


  //Buscamos una categoría para asignarla al producto
  const category = await Category.findOne({ name: "Electronics" });
  

  //Creamos el body del nuevo producto
  const newProduct = {
    name: "notebook",
    price: 1000,
    stock: 5,
    category: category.id,
  };

//Hacemos la petición para crear el producto, incluyendo el token en el header
  const response = await request(app)
    .post("/products").send(newProduct).set("Authorization", `Bearer ${login.body.token}`);

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property("name");
   expect(response.body.name).to.equal("notebook");
});
 it("should return product by id ", async function() {
  
  const product = await Product.findOne();
  const response = await request(app).get(`/products/${product._id}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("name");
    expect(response.body.name).to.equal("Mouse");


    expect(response.body).to.have.property("category");
    expect (response.body.category).to.be.an("object");
    expect(response.body.category).to.have.property("name");
    expect(response.body.category.name).to.equal("Electronics");
});


it ("should return error 400 for invalid id", async function() {
     const response = await request(app).get("/products/123");
     expect(response.status).to.equal(400);
   });

 it("should return 404 if product not found", async function() {
  const nonExistentId = "64a1f0c2e1b2c3d4e5f67890"; // ID que no existe en la base de datos
  const response = await request(app).get(`/products/${nonExistentId}`);
  expect(response.status).to.equal(404);
 }); 

it("should return 422 if name is missing", async function() {

    const login = await request(app)
    .post("/auth/login")
    .send({ email: "test@example.com", 
      password: "123456" 
    });


  const category = await Category.findOne();

  const newProduct = {
    price: 100,
    stock: 5,
    category: category.id
  };
  
  const response = await request(app)
    .post("/products").send(newProduct).set("Authorization", `Bearer ${login.body.token}`);
  expect(response.status).to.equal(422);
});
   

   it("should update product", async function (){

      const login = await request(app)
    .post("/auth/login")
    .send({ email: "test@example.com", 
      password: "123456" 
    });

    const product = await Product.findOne();
    product.name = "Mouse Gamer";

    const updateProduct ={
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category
    };
    const response = await request(app)
    .put(`/products/${product._id}`).send(updateProduct).set("Authorization", `Bearer ${login.body.token}`);
    expect(response.status).to.equal(200);
    expect(response.body.name).to.equal("Mouse Gamer");
    
   });


   it ("should delete product", async function() {

    const login = await request(app)
    .post("/auth/login")
    .send({ email: "test@example.com", 
      password: "123456" 
    });


    const product = await Product.findOne();

    const response = await request(app)
    .delete(`/products/${product._id}`).set("Authorization", `Bearer ${login.body.token}`);
    expect(response.status).to.equal(204);
   });



   it (" should return products of one category with populate category", async function() {

   const category = await Category.findOne({ name: "Electronics" });

   const response = await request(app).get(`/products/category/${category._id}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array");
    expect(response.body.length).to.equal(1);
    
   expect(response.body[0]).to.have.property("category");
   expect(response.body[0].category).to.be.an("object");
   expect(response.body[0].category.name).to.equal("Electronics");
   
  });


  it ("should return an empty array if category has no products", async function() {
    const newCategory = await Category.create({
      name: "Prueba",
    
    });
    const response = await request(app).get(`/products/category/${newCategory._id}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array");
    expect(response.body.length).to.equal(0);

  });

it ("should return error 400 for invalid id", async function() {
     const response = await request(app).get("/products/category/123");
     expect(response.status).to.equal(400);
   });


it("Saber si un producto tiene la categoría Hardware", async function () {
  const category = await Category.create({
    name: "Hardware",
  });
  const product = await Product.create({
    name: "Teclado",
    price: 80,
    stock: 10,
    category: category._id
  });
  const response = await request(app).get(`/products/category/${category._id}`);
  expect(response.status).to.equal(200);
  expect(response.body).to.be.an("array");
  expect(response.body.length).to.equal(1);
  expect(response.body[0]).to.have.property("category");
  expect(response.body[0].category).to.be.an("object");
  expect(response.body[0].category.name).to.equal("Hardware");
  
});
  it ("should return 403 if user is not owner of the product", async function(){
    // Primero, registramos un nuevo usuario
    await request(app)
    .post("/auth/register")
    .send({ email: "other@example.com", 
      password: "123456" 
    });

 // Luego, hacemos login con el nuevo usuario para obtener su token
    const login = await request(app)
    .post("/auth/login")
    .send({ email: "other@example.com", 
      password: "123456" 
    });
 // Buscamos un producto que no sea del nuevo usuario
    const product = await Product.findOne({ name: "Mouse" });

 // Intentamos actualizar el producto con el token del nuevo usuario
    const updateProduct ={
      name: "Nuevo Mouse Gamer",
      
    };   
    const response = await request(app)
    .put(`/products/${product._id}`)
    .send(updateProduct)
    .set("Authorization", `Bearer ${login.body.token}`);

    expect(response.status).to.equal(403);
   
});

});
