const express = require("express");
const cors = require("cors");

const app = express();
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const { createUser, login } = require("./controllers/users");
const auth = require("./middlewares/auth");

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use(cors());

app.use("/", mainRouter);

app.post("/signin", login);
app.post("/signup", createUser);

app.use(auth);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
