const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const errorMiddleWare = require("./middleware/error");
const path = require("path");
const cors = require("cors");
const fileUpload = require("express-fileupload");

//Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

app.use(cookieParser());

app.use(fileUpload());

//using Middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

//Route Imports

const postRoute = require("./routes/postRoutes");
const userRoute = require("./routes/userRoute");

app.use(cors());

app.use("/api/v1", userRoute);
app.use("/api/v1", postRoute);

//=============================for live api check===============================

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

// ================================================================

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1);

//MidleWare For Error
app.use(errorMiddleWare);

module.exports = app;
