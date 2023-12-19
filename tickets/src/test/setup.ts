import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../app";
import request from "supertest";
let mongo: MongoMemoryServer;
//first test is gonna take some time as the MongoServer has to start, but the subsequent tests will be relatively quicker
beforeAll(async () => {
  try {
    process.env.JWT_KEY = "AUTH_APP";
    const mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    await mongoose.connect(mongoUri, {});
  } catch (err) {
    console.log("Error during before all");
  }
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.drop();
    console.log("collection dropped is ", collection.collectionName);
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
    console.log("Mongo server stopped");
  }
  await mongoose.connection.close();
  console.log("mongoose connection closed");
});

//declaring a  global signup function
declare global {
  var signup: () => string[];
}

global.signup = () => {
  //build  a JWT payload {id,email}

  const payload = {
    id: "fk34nfsfs",
    email: "test@test.com",
  };
  //create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //build a session object {jwt:value}

  const session = { jwt: token };

  //turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  //Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  //return a string thats the cookie with the encoded data
  //this has to be converted to an array for supertest to be able to work with it
  return [`session=${base64}`];
};
