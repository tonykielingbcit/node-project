"use strict"

/***************************************************************/
/**************** DB CONNECTION ********************************/
/***************************************************************/
require("./db/connect.js");



/***************************************************************/
/**************** REQUIREMENTS *********************************/
/***************************************************************/
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
// const logger = require('morgan');
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const passport = require("passport");
const LocalStrategy = require("passport-local");



/***************************************************************/
/**************** GETTING THE ROUTES ***************************/
/***************************************************************/
const indexRouter = require("./routes/indexRouter.js");
const profilesRouter = require("./routes/profilesRouter.js");
const commentsRouter = require("./routes/commentsRouter.js");
const registerRouter = require("./routes/registerRouter.js");
const loginRouter = require("./routes/loginRouter.js");
const logoutRouter = require("./routes/logoutRouter.js");



/***************************************************************/
/**************** SETTINGS *************************************/
/***************************************************************/
// Use environment variable if defined, or a fixed value if not.
const PORT = process.env.PORT || 3003;
// morgan is set ON
// app.use(logger("combined"));

app.use(cors());

app.use(express.static('public'));

app.set("views", path.join(__dirname, "views"));
// set the view engine to ejs
app.set("view engine", "ejs");

// Enable layouts
app.use(expressLayouts);
// Set the default layout
app.set("layout", "./layouts/full-width");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// handle image upload
app.use(fileUpload({
    createParentPath: true,
  })
);



/***************************************************************/
/**************** SETTINGS FOR ADMISSION PROCESSES *************/
/***************************************************************/
// Set up session management
app.use(
  require("express-session")({
    secret: process.env.secret,
    resave: true, // session renew is ON
    cookie: { _expires : 1000 * 60 * 20 }, // 20 minutes session
    saveUninitialized: false,
  })
);

// Initialize passport and configure for User model
app.use(passport.initialize());
app.use(passport.session());
const Profile = require("./models/Profile.js");
passport.use(new LocalStrategy(Profile.authenticate()));
passport.serializeUser(Profile.serializeUser());
passport.deserializeUser(Profile.deserializeUser());



/***************************************************************/
/**************** USING THE ROUTES *****************************/
/***************************************************************/
const protecRoute = require("./services/protectRoute.js");
const checkAuths = require("./services/checkAuths.js");
app.use(checkAuths);  // it checks authentication and authorization

app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/profiles", protecRoute, profilesRouter);
app.use("/comments", protecRoute, commentsRouter);
app.use(indexRouter);

// this is a just in case default route - it is not supposed to be reached
app.get("*", (req, res) => res.status(404)
            .send("<h2 style='text-align: center; color: red; margin-top: 2rem;'>No page has been found</h2>")
);



/***************************************************************/
/**************** APP RUNNING **********************************/
/***************************************************************/
app.listen(PORT, () => {
    console.log(` => Server running at http://localhost:${PORT}`);
});
  
