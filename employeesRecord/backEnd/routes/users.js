const router = require("express-promise-router")();
const passport = require("passport");

const passportConfig = require("../passport");
const { validateBody, schemas } = require("../helpers/routeHelpers");
const UserController = require("../controllers/users");

const passportJWT = passport.authenticate("jwt", { session: false });
const passportGoogle = passport.authenticate("google-token", {
  session: false,
  failWithError: true,
});
const passportFacebook = passport.authenticate("facebook-token", {
  session: false,
  failWithError: true,
});

const passportSignIn = passport.authenticate("local", {
  session: false,
  failWithError: true,
});

// router.post("/signup", validateBody(schemas.authSchema), UserController.signUp);
router
  .route("/signup")
  .post(validateBody(schemas.signUpAuthSchema), UserController.signUp);

router.route("/signin").post(
  validateBody(schemas.signInAuthSchema),
  passportSignIn,
  (err, req, res, next) => {
    //console.log("ERROR from authorization(passport.js) : ", err);
    try {
      if (req.body.error) {
        return res.status(401).send({ error: req.body.error });
      }
      return next();
    } catch (error) {
      return next(error);
    }
  },
  UserController.signIn
);

router
  .route("/oauth/google")
  .post(passportGoogle, UserController.oauths.googleOauth);
router
  .route("/oauth/facebook")
  .post(passportFacebook, UserController.oauths.facebookOauth);

router.route("/activate-account/:id").get(UserController.activtateAccount);

router.route("/reset-password").post(UserController.resetPassword);
router
  .route("/verify-password-reset-code")
  .post(UserController.verifyPasswordResetCode);

router.route("/update-password").post(UserController.updatePassword);

router.route("/get-data").get(passportJWT, UserController.getData);

router.route("/send-data").post(passportJWT, UserController.sendData);

router.route("/delete-data").post(passportJWT, UserController.deleteData);

router.route("/update-data").post(passportJWT, UserController.updateData);

router.route("/delete-account").post(passportJWT, UserController.deleteAccount);

module.exports = router;
