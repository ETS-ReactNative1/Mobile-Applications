const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const LocalStrategy = require("passport-local").Strategy;

const GoogleTokenStrategy = require("passport-google-token").Strategy;
const FacebookTokenStrategy = require("passport-facebook-token");

const { JWT_SECRET, oauth } = require("./configuration/index");
const User = require("./models/user");

//JSON WEB TOKENS STRATEGY
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader("authorization"),
      secretOrKey: JWT_SECRET,
    },
    async (payLoad, done) => {
      try {
        // Find the user specified in the token
        const user = await User.findById(payLoad.sub);
        // console.log("User : ", user);

        // If user doesn't exist , handle it
        if (!user) {
          return done(null, false); // done(error is there or not, user exist or not)
        }

        // Otherwise, return the user
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

// GOOGLE OAUTH STRATEGY
passport.use(
  "google-token", // Name of the strategy
  new GoogleTokenStrategy(
    {
      clientID: oauth.google.clientID,
      clientSecret: oauth.google.clientSecret,
    },
    async (accessToken, refereshToken, profile, done) => {
      try {
        // console.log("accessToken : ", accessToken);
        // console.log("refreshToken : ", refereshToken);
        // console.log("profile : ", profile);

        // Check whether this current user exists in our database
        const existingUser = await User.findOne({ "google.id": profile.id });
        if (existingUser) {
          return done(null, existingUser);
        }

        // If no user found, create new user
        const newUser = new User({
          method: "google",
          google: {
            id: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
          },
        });
        await newUser.save();
        done(null, newUser);
      } catch (error) {
        console.log("Error : ", error);
        return done(error, false, error.message);
      }
    }
  )
);

// FACEBOOK OAUTH STRATEGY
passport.use(
  "facebook-token",
  new FacebookTokenStrategy(
    {
      clientID: oauth.facebook.clientID,
      clientSecret: oauth.facebook.clientSecret,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("Hello");
      try {
        // console.log("accessToken : ", accessToken);
        // console.log("refreshToken : ", refreshToken);
        // console.log("profile : ", profile);

        // Check whether this current user exists in our database
        const existingUser = await User.findOne({ "facebook.id": profile.id });
        if (existingUser) {
          return done(null, existingUser);
        }

        // If no user found, create new user
        const newUser = new User({
          method: "facebook",
          facebook: {
            id: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
          },
        });
        await newUser.save();
        done(null, newUser);
      } catch (error) {
        console.log("Error occurred : ", error);
        return done(error, false, error.message);
      }
    }
  )
);

//LOCAL STRATEGY
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        //Find the user given the email
        const user = await User.findOne({ "local.email": email });

        // If user not found, handle it
        if (!user) {
          req.body["error"] = "Incorrect E-mail.";
          //console.log(req.body);
          return done(null, false);
        }

        // Check if the password is correct
        const isMatch = await user.isValidPassword(password);
        // If password is incorrect, handle it
        if (!isMatch) {
          req.body["error"] = "Incorrect password.";
          return done(null, false, { message: "Incorrect password." });
        }

        // otherwise, return the user
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: "email",
//     },
//     function (email, password, done) {
//       User.findOne({ email }, function (err, user) {
//         if (err) {
//           return done(err);
//         }
//         if (!user) {
//           return done(null, false, { message: "Incorrect username." });
//         }
//         if (!user.isValidPassword(password)) {
//           return done(null, false, { message: "Incorrect password." });
//         }
//         return done(null, user);
//       });
//     }
//   )
// );
