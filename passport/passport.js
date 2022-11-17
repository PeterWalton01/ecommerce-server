const LocalStrategy = require("passport-local").Strategy;
var GoogleStrategy = require("passport-google-oidc");
var db = require("../db");
const bcrypt = require("bcrypt");
const { getUserByEmail, getUserById } = require("../controller/userController");
let user;

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    user = await getUserByEmail(email);

    if (user === false || typeof user === "undefined") {
      return done(null, false, { message: "No such email" });
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Incorrect password" });
      }
    } catch (e) {
      return done(e);
    }
  };

  const verify = (issuer, profile, cb) => {
    const email = profile.emails[0].value;

    db.get(
      "SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?",
      [issuer, profile.id],
      function (err, row) {
        if (err) {
          return cb(err);
        }
        if (!row) {
          db.run(
            "INSERT INTO users (name, email) VALUES (?,?)",
            [profile.displayName, email],
            function (err) {
              if (err) {
                return cb(err);
              }

              var id = this.lastID;
              db.run(
                "INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)",
                [id, issuer, profile.id],
                function (err) {
                  if (err) {
                    return cb(err);
                  }
                  user = {
                    user_id: id,
                    email: email,
                    name: profile.displayName,
                  };

                  return cb(null, user);
                }
              );
            }
          );
        } else {
          db.get(
            "SELECT * FROM users WHERE id = ?",
            [row.user_id],
            function (err, row) {
              if (err) {
                return cb(err);
              }
              if (!row) {
                return cb(null, false);
              }

              user = {
                user_id: row.id,
                email: row.email,
                name: profile.displayName,
              };

              return cb(null, user);
            }
          );
        }
      }
    );
  };

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env["GOOGLE_CLIENT_ID"],
        clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
        callbackURL: "/auth/oauth2/redirect/google",
        scope: ["profile", "email"],
      },
      verify
    )
  );

  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      authenticateUser
    )
  );

  passport.serializeUser((user, done) => done(null, user.user_id));
  // passport.deserializeUser((id, done) => {
  //   done(null, user);
  // });
  passport.deserializeUser((id, done) => {
    done(null, getUserById(id));
  });
}
module.exports = initialize;
