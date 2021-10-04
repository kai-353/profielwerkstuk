const express = require("express");
const router = express.Router();
const passport = require("passport");
var db = require("../config/conn")();

const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

router.get("/login", forwardAuthenticated, (req, res) =>
  res.render("login", { user: req.user })
);

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/profile/:id", (req, res) => {
  var id = req.params.id;
  db.query(
    `SELECT username, email, DATE_FORMAT(created_at, "%b %d '%y %H:%i") AS 'created_at' FROM users WHERE id = '${id}'`,
    (err, result) => {
      console.log(result[0]);
      if (typeof result[0] != "undefined") {
        res.render("profile", { user: req.user, profile: result[0] });
      } else {
        res.redirect("/");
      }
    }
  );
});

router.get("/register", forwardAuthenticated, (req, res) =>
  res.render("register", { user: req.user })
);

router.post("/register", (req, res) => {
  const { username, email, password, password2 } = req.body;
  let errors = [];

  if (!username || !email || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (email.length > 90) {
    errors.push({ msg: "email too long" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      username,
      email,
      password,
      password2,
    });
  } else {
    db.query(
      `SELECT email FROM users WHERE email = '${email}'`,
      (err, result) => {
        if (result[0] != undefined) {
          errors.push({ msg: "Email already exists" });
          res.render("register", {
            errors,
            username,
            email,
            password,
            password2,
          });
        } else {
          const newUser = {
            username,
            email,
            password,
          };
          db.query("INSERT INTO users SET ?", newUser, (err, result) => {
            if (err) throw err;
            req.flash("success_msg", "You are now registered and can log in");
            res.redirect("/users/login");
          });
        }
      }
    );
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  req.user = undefined;
  res.redirect("/users/login");
});

router.get("/favorites", ensureAuthenticated, (req, res) => {
  db.query(
    `SELECT fp.*, p.*, u.username, COUNT(pc.post) AS 'comment_count' FROM fav_posts AS fp
	INNER JOIN posts AS p
    ON fp.post_id = p.id
    INNER JOIN users as u
    ON p.posted_by = u.id
    LEFT JOIN posts_comments AS pc
    ON p.id = pc.post
    WHERE fp.user_id = ${req.user.id}
    GROUP BY p.id DESC;`,
    (err, posts) => {
      if (err) throw err;
      // res.send(posts);
      res.render("favorites", { user: req.user, fav_posts: posts });
    }
  );
});

router.get("/favorites/new", ensureAuthenticated, (req, res) => {
  if (typeof req.query.id == "undefined") {
    res.redirect("/forum/1");
  } else {
    const user_id = req.user.id;
    const post_id = req.query.id;

    const new_fav = { user_id, post_id };
    const sql = "INSERT INTO fav_posts SET ?";

    db.query(sql, new_fav, (err, result) => {
      if (err) throw err;
      res.redirect(`/forum/post/${req.query.id}`);
    });
  }
});

router.get("/favorites/delete", ensureAuthenticated, (req, res) => {
  if (typeof req.query.id == "undefined") {
    res.redirect("/forum/1");
  } else {
    const user_id = req.user.id;
    const post_id = req.query.id;

    const sql = `DELETE FROM fav_posts WHERE user_id = ${user_id} AND post_id = ${post_id}`;

    db.query(sql, (err, result) => {
      if (err) throw err;
      res.redirect(`/forum/post/${post_id}`);
    });
  }
});

module.exports = router;
