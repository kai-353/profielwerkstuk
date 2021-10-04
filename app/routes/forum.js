const express = require("express");
const { ensureAuthenticated } = require("../config/auth");
const router = express.Router();
var db = require("../config/conn")();

router.get("/create/post", ensureAuthenticated, (req, res) => {
  res.render("create-post");
});

router.get("/forum/favorite", ensureAuthenticated, (req, res) => {
  res.send("favorited");
});

router.post("/create/post", ensureAuthenticated, (req, res) => {
  const { title, body } = req.body;
  const id = req.user.id;
  var empty = false;

  if (typeof title == "undefined" || typeof body == "undefined") {
    empty = true;
  }

  const new_post = { title: title, body: body, posted_by: id };
  let sql = "INSERT INTO posts SET ?";

  if (!empty) {
    db.query(sql, new_post, (err, result) => {
      console.log(result);
      console.log("dat was het result");
      res.redirect(`/forum/post/${result.insertId}`);
    });
  } else {
    console.log("niet gelukt");
    res.redirect(`/forum/1`);
  }
});

router.post("/create/comment", ensureAuthenticated, (req, res) => {
  const { post, body } = req.body;
  const id = req.user.id;
  var empty = false;

  if (typeof body == "undefined" || typeof post == "undefined") {
    empty = true;
  }

  const new_comment = { body: body, posted_by: id, post: post };
  let sql = "INSERT INTO posts_comments SET ?";
  if (!empty) {
    db.query(sql, new_comment, (err, result) => {
      res.redirect(`/forum/post/${post}`);
    });
  } else {
    res.redirect(`/forum/1`);
  }
});

router.get("/:pagenr", (req, res) => {
  const per_page = 7;

  if (
    typeof req.query.keyword != "undefined" &&
    req.query.keyword.trim() == ""
  ) {
    res.redirect(`/forum/${req.params.pagenr}`);
    return;
  }

  const keyword = `%${
    typeof req.query.keyword != "undefined" ? req.query.keyword : ""
  }%`;

  var pagenr = parseInt(req.params.pagenr);
  pagenr = isNaN(pagenr) || pagenr < 1 ? 1 : pagenr;

  const sql = `
    SELECT p.*, u.username, COUNT(pc.post) AS 'comment_count' FROM posts AS p
	INNER JOIN users AS u
    ON p.posted_by = u.id
    LEFT JOIN posts_comments AS pc
    ON p.id = pc.post
    WHERE p.body LIKE '${keyword}' OR p.title LIKE '${keyword}'
    GROUP BY p.id DESC
    LIMIT ${per_page} OFFSET ${pagenr * per_page - per_page};
    `;
  db.query(sql, (err, result) => {
    if (err) throw err;
    db.query(
      "SELECT COUNT(*) AS 'number_of_posts' FROM posts;",
      (err, amount) => {
        if (err) throw err;
        const max = Math.ceil(amount[0].number_of_posts / per_page);
        console.log(max, "max", result.length, keyword);
        if (result.length == 0 && keyword == "%%" && pagenr != 1) {
          console.log("redirecting...");
          res.redirect("/forum/1");
          return;
        }
        res.render("forum", {
          posts: result,
          pagenr,
          max,
          keyword: req.query.keyword,
          user: req.user,
        });
      }
    );
  });
});

router.get("/post/:id", (req, res) => {
  var id = req.params.id;
  db.query(
    `\
    SELECT p.id, p.title, p.body, p.posted_by, DATE_FORMAT(p.created_at, "%b %d '%y at %H:%i") AS 'created_at', u.username, COUNT(pc.post) AS 'comment_count' FROM posts AS p\
	INNER JOIN users AS u\
    ON p.posted_by = u.id\
    LEFT JOIN posts_comments AS pc\
    ON p.id = pc.post\
    WHERE p.id = '${id}'\
    `,
    (err, post) => {
      if (err) throw err;
      console.log(post[0]);
      db.query(
        `
        SELECT pc.id, pc.body, pc.parent_comment, DATE_FORMAT(pc.created_at, "%b %d '%y at %H:%i") AS 'created_at', pc.posted_by, u.username
        FROM posts_comments as pc
        INNER JOIN users as u ON pc.posted_by = u.id
        WHERE pc.post = ${post[0].id}
        ORDER BY pc.created_at;`,
        (err, comments) => {
          if (typeof req.user != "undefined") {
            db.query(
              `SELECT * FROM fav_posts WHERE user_id = ${req.user.id} AND post_id = ${post[0].id}`,
              (err, result) => {
                if (err) throw err;
                if (typeof result[0] == "undefined") {
                  console.log(comments);
                  res.render("post", {
                    user: req.user,
                    post: post[0],
                    comments: comments,
                    in_favs: false,
                  });
                } else {
                  console.log(comments);
                  res.render("post", {
                    user: req.user,
                    post: post[0],
                    comments: comments,
                    in_favs: true,
                  });
                }
              }
            );
          } else {
            console.log(comments);
            res.render("post", {
              user: req.user,
              post: post[0],
              comments: comments,
              in_favs: false,
            });
          }
        }
      );
    }
  );
});

module.exports = router;
