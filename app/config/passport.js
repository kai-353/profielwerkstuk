const LocalStrategy = require("passport-local").Strategy;

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      (req, email, password, done) => {
        req.db.query(
          `SELECT * FROM users WHERE email = '${email}'`,
          (err, result) => {
            if (err) throw err;
            if (result[0] != undefined) {
              user = result[0];
              if (user["password"] == password) {
                return done(null, user);
              } else {
                return done(null, false, { message: "Password incorrect" });
              }
            } else {
              return done(null, false, {
                message: "That email is not registered",
              });
            }
          }
        );
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (req, id, done) {
    req.db.query(`SELECT * FROM users WHERE id = ${id}`, (err, result) => {
      done(err, result[0]);
    });
  });
};
