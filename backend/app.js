const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
mongoose
  .connect(
    "mongodb+srv://Dileep:WcJ2iyeSaXUXXDHI@cluster0-jwd1g.mongodb.net/postsDB?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((success) => {
    console.log("Database Connected Successfully");
  })
  .catch((err) => {
    console.log(err);
    console.log("Error in connectivity");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));
// to resolve CORS Policy Error
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, PATCH, OPTIONS, PUT"
  );
  next();
});

app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
