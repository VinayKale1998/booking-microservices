import express from "express";
import {} from "dotenv/config";

const app = express();

app.use(express.json());

const PORT = process.env.PORT;

app
  .listen(PORT, () => {
    console.log(`Auth server is listening to port ${PORT}`);
  })
  .on("error", (err: Error) => {
    console.log(`server failed to start : ${err}`);
  });
