const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const path = require("path");
const passport = require('passport');
// const mysql = require("mysql");

require('./config/passport')(passport);

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Create DB connection
var db = require("./config/conn")();
// var db = mysql.createConnection(config);
// var db = mysql.createConnection({
//   host      : 'localhost',
//   user      : "root",
//   password  : "",
//   database  : "nodemysqltest"
// });

// db.connect((err) => {
//   if(err) {
//       throw err;
//   }
//   console.log("Connected");
// });

app.use(expressLayouts);
app.set("view engine", "ejs");
app.set('view options', { layout:'layout.ejs' });

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// app.locals.colors = {
//   languid_lavender: "#CEC4D4",
//   chinese_violet: "#6D597A",
//   sunglow: "#FFCF33",
//   banana_mania: "#FFEDB3",
//   orange_peel: "#F99D03",
// };

app.get("/", (req, res) => {
  // console.log(req.isAuthenticated());
  res.render("index", {user: req.user});
});

app.get("/images/:image", (req, res) => {
  res.sendFile(path.join(__dirname, "../app/images/", req.params.image));
});

app.get("/css/:stylesheet", (req, res) => {
  res.sendFile(path.join(__dirname, "../app/views/css/", req.params.stylesheet));
});

// app.get("/random", (req, res) => {
//   let random = {random: 5};
//   // let random = {random: null};
//   let sql = 'INSERT INTO test SET ?';
//   let query = db.query(sql, random, (err, result) => {
//     if (err) throw err;
//     res.send({ id: result["insertId"] });
//   });
// });

app.use('/users', require('./routes/users.js'));
app.use('/forum', require('./routes/forum.js'))

// app.get("/posts", (req, res) => {
//   let sql = "SELECT * FROM users WHERE username = 'Kai-353'";
//   let query = db.query(sql, (err, result) => {
//     if (err) throw err;
//     res.send(result[0]['email']);
//   });
// });

const PORT = process.env.PORT || 5000;

server.listen(PORT, console.log(`Server running on  ${PORT}`));
