const passport = require("passport");
const { BasicStrategy } = require("passport-http");
const boom = require("boom");
const bcrypt = require("bcrypt");
const MongoLib = require("../../../lib/mongo");

console.log("ejecutando basic");

passport.use(
  new BasicStrategy(async function(username, password, cb) {
    const mongoDB = new MongoLib();
    console.log(username);
    console.log(password);

    try {
      const [user] = await mongoDB.getAll("users", { username });

       console.log("encontraste el usuario"+user);

      if (!user) {
        return cb(boom.unauthorized(), false);
      }

      if (!(await bcrypt.compare(password, user.password))) {
        return cb(boom.unauthorized(), false);
      }

      return cb(null, user);
    } catch (error) {
      return cb(error);
    }
  })
);