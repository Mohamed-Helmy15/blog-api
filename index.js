const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const xss = require("xss-clean");
const ExpressMongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const userRoute = require("./routes/userRoute");
const blogRoute = require("./routes/blogRoute");

const errorController = require("./controller/errorController");
const AppError = require("./utils/appError");
const cookieParser = require("cookie-parser");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(ExpressMongoSanitize());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(xss());
app.use(compression());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://blog-app-forntend.vercel.app"],
  })
);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/blogs", blogRoute);
// app.use("/api/v1/sections", sectionRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`can not find ${req.originalUrl} on the server `, 404));
});

app.use(errorController);

const port = process.env.PORT;
const DB = process.env.MONGODB;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => console.log(`server running on port ${port}`));
  })
  .catch((err) => console.log(err));
