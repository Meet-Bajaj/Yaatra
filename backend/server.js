require("dotenv").config();
require("./config/db");

const hpp = require("hpp");
const cors = require("cors");
const helmet = require("helmet");
const express = require("express");
const User = require("./models/users");
const app = express();

const setupSwagger = require("./swagger");

app.use(helmet());
app.use(hpp());
app.use(cors());
app.use(express.json());

// Initialize Swagger docs
setupSwagger(app);

app.use("/api/v1", require("./routes"));

app.get("/", (req, res) => {
  const result = User.find();
  result.then((users) => {
    console.log(users);
  }).catch((err) => {
    console.error(err);
  });
  res.send("Welcome to RickRide API");
});

app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
