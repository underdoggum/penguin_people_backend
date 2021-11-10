////////////////////////////////////
// Dependencies
////////////////////////////////////
require("dotenv").config();
// pull "PORT" and "DATABASE_URL" from .env, give it a default value of 3000 in case the .env file isn't getting the port we set it to
const { PORT = 3000, DATABASE_URL } = process.env;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
// import middleware
const cors = require("cors");
const morgan = require("morgan");


////////////////////////////////////
// Database connection
////////////////////////////////////
// establish the connection
mongoose.connect(DATABASE_URL, { useUnifiedTopology: true, useNewUrlParser: true });
// connection events
mongoose.connection
  .on("open", () => console.log("Connected to Mongo"))
  .on("close", () => console.log("Disconnected from Mongo"))
  .on("error", error => console.log(error));


////////////////////////////////////
// Models
////////////////////////////////////
const peopleSchema = new mongoose.Schema({
  name: String,
  image: String,
  title: String,
}, { timestamps: true });

const People = mongoose.model("People", peopleSchema);


////////////////////////////////////
// Middleware
////////////////////////////////////
app.use(cors());          // to prevent cors errors, open access to all origins
app.use(morgan("dev"));   // logging
app.use(express.json());  // parse json bodies



////////////////////////////////////
// Routes
////////////////////////////////////
// test route
app.get("/", (req, res) => {
  res.send("Hello world!");
});

// people index route
app.get("/people", async (req, res) => {
  try {
    // send all people
    res.json(await People.find({}));
  } catch (error) {
    // send error
    res.status(400).json(error);
  }
});

// people create route
app.post("/people", async (req, res) => {
  try {
    // send all people
    res.json(await People.create(req.body));
  } catch (error) {
    res.status(400).json(error);
  }
});

// people update route
app.put("/people/:id", async (req, res) => {
  try {
    // update a person
    res.json(await People.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (error) {
    res.status(400).json(error);
  }
});

// destroy route
app.delete("/people/:id", async (req, res) => {
  try {
    // delete a person
    res.json(await People.findByIdAndRemove(req.params.id));
  } catch (error) {
    res.status(400).json(error);
  }
});






////////////////////////////////////
// Listener
////////////////////////////////////
app.listen(PORT, () => {
  console.log(`App is listening on port: ${PORT}`);
});
