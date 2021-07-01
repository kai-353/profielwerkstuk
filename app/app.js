const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(expressLayouts);
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use(
    session({
      secret: "secret",
      resave: true,
      saveUninitialized: true,
    })
  );

app.use(flash());

app.use(function (req, res, next) {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

app.locals.colors = {
    languid_lavender: "#CEC4D4",
    chinese_violet: "#6D597A",
    sunglow: "#FFCF33",
    banana_mania: "#FFEDB3",
    orange_peel: "#F99D03"
};

app.get("/", (req, res) => res.render("index"));

const PORT = process.env.PORT || 5000;

server.listen(PORT, console.log(`Server running on  ${PORT}`));