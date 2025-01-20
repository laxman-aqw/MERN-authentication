const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const routes = require("./routes/authRoute");
require("dotenv").config();
const port = process.env.PORT;
const dbUri = process.env.DATABASE_URI;
const session = require("express-session");

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by");

app.use(
  session({
    secret: process.env.JWT_SECRET, // Session secret
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't save uninitialized sessions
    cookie: { secure: false, maxAge: 60 * 60 * 1000 }, // Set to true if using HTTPS
  })
);

app.use("/api", routes);

mongoose.connect(dbUri).then(() => {
  try {
    console.log("Database connected");
    app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}/`);
    });
  } catch (error) {
    console.log("Server connection error");
  }
});
