const LocalStrategy = require("passport-local").Strategy;
var db = require('./conn')();

module.exports = function (passport) {
    passport.use(
        new LocalStrategy(
            { usernameField: "email" },
            (email, password, done) => {
                let query = db.query(`SELECT * FROM users WHERE email = '${email}'`, (err, result) => {
                    if (err) throw err;
                    if (result[0] != undefined) {
                        user = result[0]
                        if (user['password'] == password) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: "Password incorrect" });
                        }
                    } else {
                        return done(null, false, { message: "That email is not registered" });
                    }
                });
            }
        )
    );

    passport.serializeUser(function (user, done) {
        done(null, user.id);
      });
    
      passport.deserializeUser(function (id, done) {
        db.query(`SELECT * FROM users WHERE id = ${id}`, (err, result) => {
            done(err, result[0]);
        });
      });
};