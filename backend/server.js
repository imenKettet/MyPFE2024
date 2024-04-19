const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const passport = require("passport");
const morgan = require("morgan");
const session = require("express-session");

require("./common/init_script");
require("dotenv").config();
require("./database/connect");
require("./middleware/bearer");

app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ limit: "100mb", extended: false }));
app.use(express.json({ limit: "100mb" }));
app.use(bodyParser.json({ limit: 100 * 1024 * 1024 }));
app.use(
  bodyParser.urlencoded({
    limit: 100 * 1024 * 1024,
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(
  session({
    resave: true,
    secret: process.env.JWT_SECRET,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

const userApi = require("./routes/userApi");
const teamApi = require("./routes/teamApi");
const projectApi = require("./routes/projectApi");
const authApi = require("./routes/authApi");
const taskApi = require("./routes/taskApi");
const absenceApi = require("./routes/absencesApi");
const chefApi = require("./routes/chefApi");
const notificationApi = require("./routes/notificationApi");

app.use("/auth", authApi);
app.use("/api/user", userApi);
app.use("/api/team", teamApi);
app.use("/api/project", projectApi);
app.use("/api/task", taskApi);
app.use("/api/absence", absenceApi);
app.use("/api/chef", chefApi);
app.use("/api/notification", notificationApi);

app.listen(4000, () => {
  console.log("server is running");
});
