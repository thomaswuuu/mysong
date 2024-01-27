const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");
const connectDB = require("./config/db");
const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const dotenv = require("dotenv");
dotenv.config();
require("./config/passport");
const passport = require("passport");
const flash = require("connect-flash");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 600000 },
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});
// Connect to database
connectDB();

// Route setting
app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

// Port binding
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
