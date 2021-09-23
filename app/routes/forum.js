const express = require("express");
const router = express.Router();
var db = require('../config/conn')();

router.get('/:pagenr', (req, res) => {
    // console.log(`%${typeof req.query.keyword != 'undefined' ? req.query.keyword : ''}%`);
    var pagenr = parseInt(req.params.pagenr)
    pagenr = isNaN(pagenr) || pagenr < 1 ? 1 : pagenr;
    const filter = `%${typeof req.query.keyword != 'undefined' ? req.query.keyword : ''}%`
    // sql = `SELECT * FROM posts WHERE title LIKE '${filter}' OR body LIKE '${filter}'`
    const sql = `\
    SELECT p.*, u.username, COUNT(pc.post) AS 'comment_count' FROM posts AS p\
	INNER JOIN users AS u\
    ON p.posted_by = u.id\
    LEFT JOIN posts_comments AS pc\
    ON p.id = pc.post\
    GROUP BY p.created_at DESC\
    LIMIT 20 OFFSET ${(pagenr * 20) - 20};\
    `
    db.query(sql, (err, result) => {
        if (err) throw err;
        // if (result.length == 0) res.redirect('/forum/1');
        db.query("SELECT COUNT(*) AS 'number_of_posts' FROM posts;", (err, amount) => {
            if (err) throw err;
            const max = Math.ceil(amount[0].number_of_posts / 20);
            res.render('forum', { posts: result, pagenr, max });
        });
    });
});

module.exports = router;