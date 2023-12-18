import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

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
