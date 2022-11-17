var sqlite3 = require("sqlite3");
var mkdirp = require("mkdirp");
var crypto = require("crypto");

mkdirp.sync("./var/db");

var db = new sqlite3.Database("./var/db/sessions.db");

db.serialize(function () {
  // create the database schema for the todos app
  db.run(
    "CREATE TABLE IF NOT EXISTS users ( \
    id INTEGER PRIMARY KEY, \
    username TEXT UNIQUE, \
    name TEXT, \
    email TEXT UNIQUE \
  )"
  );

  db.run(
    "CREATE TABLE IF NOT EXISTS federated_credentials ( \
    id INTEGER PRIMARY KEY, \
    user_id INTEGER NOT NULL, \
    provider TEXT NOT NULL, \
    subject TEXT NOT NULL, \
    UNIQUE (provider, subject) \
  )"
  );

  // create an initial user (username: alice, password: letmein)
  db.run("INSERT OR IGNORE INTO users (username, email) VALUES (?,?)", [
    "alice",
    "dummy@none.com",
  ]);
});

module.exports = db;
