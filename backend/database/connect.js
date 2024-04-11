const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/pfe")
  .then((success) => {
    console.log("succefuly connected to database");
  })
  .catch((error) => {
    console.log("error connecting to database ");
  });
