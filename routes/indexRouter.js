const express = require("express");
const indexRouter = express.Router();
const sendError = require("../services/sendError.js");


indexRouter.get("/", (req, res) => {
        return res.render("index", {
            title: "SSD Yearbook - Home",
            profile: req.isLogged ? req.profile : undefined,
            isLogged: req.isLogged
        });
    }
);


indexRouter.get("/about", (req, res) => res.render("about", {
        title: "SSD Yearbook - About",
        profile: req.isLogged ? req.profile : undefined,
        isLogged: req.isLogged
    })
);


// this is the default route
// when a page is not found, this will be reached
indexRouter.get("*", (req, res) => sendError(req, res));


module.exports = indexRouter;