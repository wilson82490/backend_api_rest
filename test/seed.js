import bcrypt from "bcryptjs";

import "../app.js";

import Product from "../models/Product.js";
import Category from "../models/Category.js";
import User from "../models/User.js";

export async function seedDatabase() {
  await User.deleteMany({});
  await Product.deleteMany({});
  await Category.deleteMany({});

  const user1 = await User.create({
    email: "test@example.com",
    password: await bcrypt.hash("123456", 10),
  });

  const user2 = await User.create({
    email: "other@example.com",
    password: await bcrypt.hash("123456", 10),
  });

  const categories = await Category.insertMany([
    { name: "Electronics" },
    { name: "Gaming" },
    { name: "Accessories" },
  ]);

  await Product.insertMany([
    {
      name: "Mouse",
      price: 80,
      stock: 10,
      category: categories[0]._id,
      owner: user1._id,
    },
    {
      name: "Keyboard",
      price: 120,
      stock: 5,
      category: categories[0]._id,
      owner: user2._id,
    },

    {
      name: "Gaming Mouse",
      price: 150,
      stock: 7,
      category: categories[1]._id,
      owner: user1._id,
    },
    {
      name: "Gaming Headset",
      price: 200,
      stock: 3,
      category: categories[1]._id,
      owner: user2._id,
    },

    {
      name: "USB Hub",
      price: 40,
      stock: 20,
      category: categories[2]._id,
      owner: user1._id,
    },
    {
      name: "Laptop Stand",
      price: 60,
      stock: 8,
      category: categories[2]._id,
      owner: user2._id,
    },
  ]);

  console.log("Database seeded");
  process.exit();
}

//seedDatabase();