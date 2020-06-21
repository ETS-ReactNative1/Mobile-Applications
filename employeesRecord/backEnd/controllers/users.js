const nodemailer = require("nodemailer");
const nodemailerSendgrid = require("nodemailer-sendgrid");
const JWT = require("jsonwebtoken");
const seedrandom = require("seedrandom");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { SENDGRID_API_KEY } = require("../configuration/index");

const User = require("../models/user");
const { JWT_SECRET } = require("../configuration/index");

const baseURL = "https://employees-record-server.herokuapp.com";
//const baseURL = "http://a0e489ffafaf.ngrok.io";

const signToken = (user) => {
  return JWT.sign(
    {
      sub: user._id,
      iss: "darshan", // optional
      iat: new Date().getTime(), // Current time // optional
      exp: new Date().setDate(new Date().getDate() + 1), // current time + 1 day ahead  // optional
    },
    JWT_SECRET
  );
};

module.exports = {
  signUp: async (req, res, next) => {
    //console.log("Hello from signup : ");
    const { name, email, password } = req.body;

    //Check if there is a user with same email
    const foundUser = await User.findOne({ "local.email": email });
    if (foundUser) {
      return res.status(403).send({ error: "E-mail already exists!" });
    }

    //Create new user
    const newUser = new User({
      method: "local",
      local: {
        email: email,
        password: password,
        name: name,
      },
    });
    await newUser.save();
    //console.log(newUser);
    //Generate the token
    const token = signToken(newUser);

    // Send account activation email
    const transport = nodemailer.createTransport(
      nodemailerSendgrid({
        apiKey: SENDGRID_API_KEY, //process.env.SENDGRID_API_KEY
      })
    );

    const link = `${baseURL}/users/activate-account/${newUser._id}`;
    transport
      .sendMail({
        from: "darshanagrawal777@gmail.com",
        to: `${newUser.local.name} <${newUser.local.email}>`,
        subject: "Employees-Record Activation Link",
        html: `<p>Hi ${newUser.local.name}!<p><br><p>Please click on the <a href="${link}">Link</a> to verify your account.</p><br><p>If you did not request this, please ignore this email.</p>`,
      })
      .then(() => {
        //console.log("E-mail sent successfully.");
        return res.status(200).send({
          message:
            "Activation link is sent to your e-mail. Kindly click it to verify your account.",
        });
      })
      .catch((err) => {
        return res.status(401).send({ error: "Error" });
        // console.log("Errors occurred, failed to deliver message");

        // if (err.response && err.response.body && err.response.body.errors) {
        //   err.response.body.errors.forEach((error) =>
        //     console.log("%s: %s", error.field, error.message)
        //   );
        // } else {
        //   console.log(err);
        // }
      });

    // Respond with token
    //res.status(200).send({ token: token });
    //res.send({ user: "created" });
  },

  activtateAccount: async (req, res) => {
    //console.log("activated");
    const { id } = req.params;

    const data = await User.findByIdAndUpdate(
      id,
      { "local.activate": true },
      { new: true }
    );
    //console.log("Data : ", data);
    //console.log("User : ", req);
    res.send(
      `<h1>Your account activated successfully.</h1><br><h2>Now, you can signin through the app to proceed futher.</h2>`
    );
  },

  resetPassword: async (req, res) => {
    const { email } = req.body;
    let user = await User.findOne({ "local.email": email });
    //console.log("USER : ", user);
    if (!user) {
      return res.status(401).send({ error: "E-mail does not exist." });
    }

    let crng = seedrandom(crypto.randomBytes(64).toString("base64"), {
      entropy: true,
    });
    //console.log(crng());

    const code = crng().toString().substring(3, 9);
    //console.log(code);

    user = await User.findOneAndUpdate(
      { "local.email": email },
      {
        $set: {
          "local.reset_password": {
            code: code,
            expire_timestamp: new Date().setMinutes(
              new Date().getMinutes() + 10
            ),
            created_timestamp: new Date().getTime(),
            verified: false,
          },
        },
      },
      { new: true }
    );

    //console.log("UPDATED USER : ", user);
    // Sending verification code via E-mail
    const transport = nodemailer.createTransport(
      nodemailerSendgrid({
        apiKey:
          "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", //process.env.SENDGRID_API_KEY
      })
    );

    transport
      .sendMail({
        from: "darshanagrawal777@gmail.com",
        to: `${user.local.name} <${user.local.email}>`,
        subject: "Employees-Record Reset Password Code",
        html: `<p>Hi ${user.local.name}!<p><br><p>Your password reset code is <h2> ${code}</h2></p><br><p>This code expires in 10 minutes.</p>`,
      })
      .then(() => {
        //console.log("E-mail sent successfully.");
        return res.status(200).send({
          message: "Password reset code is sent to your e-mail.",
        });
      })
      .catch((err) => {
        return res
          .status(401)
          .send({ error: "Error in mailing the verification code" });
      });
  },

  verifyPasswordResetCode: async (req, res) => {
    const { code, email } = req.body;
    let user = await User.findOne({ "local.email": email });
    if (user.local.reset_password.code !== code.trim()) {
      return res.status(401).send({ error: "Incorrect code." });
    } else if (
      user.local.reset_password.expire_timestamp < new Date().getTime()
    ) {
      return res
        .status(401)
        .send({ error: "Code expired!! Please request new code." });
    }

    return res.status(200).send({ message: "Successfully verified the code." });
  },

  updatePassword: async (req, res) => {
    const { email, password } = req.body;
    let passwordHash = "";
    try {
      //Generate a salt
      const salt = await bcrypt.genSalt(10);
      //Generate a password hash (salt + hash)
      passwordHash = await bcrypt.hash(password, salt);
    } catch (error) {
      return res.status(401).send({
        error: "Error occurred during password reset. Please try again.",
      });
    }

    const user = await User.findOneAndUpdate(
      { "local.email": email },
      {
        $set: {
          "local.password": passwordHash,
        },
      },
      { new: true }
    );
    //console.log(user);

    return res
      .status(200)
      .send({ message: "Your password updated successfully." });
  },

  signIn: async (req, res, next) => {
    // generate token
    const token = signToken(req.user);
    // Respond with token
    if (req.user.local.activate === true) {
      return res.status(200).send({ token });
    } else {
      return res
        .status(401)
        .send({ error: "Kindly activate your account before login." });
    }
  },

  oauths: {
    googleOauth: async (req, res) => {
      //console.log("req.user : ", req.user);
      //Generate Token
      const token = signToken(req.user);
      res.status(200).send({ token });
    },

    facebookOauth: async (req, res) => {
      //console.log("req.user : ", req.user);
      //Generate Token
      const token = signToken(req.user);
      res.status(200).json({ token: token, user: req.user });
    },
  },

  getData: async (req, res) => {
    const user = req.user;
    //console.log("user,userInfo : ", user.userInfo);
    res.send(user);
  },
  sendData: async (req, res) => {
    //console.log(req.body);
    const user = req.user;
    let info = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      salary: req.body.salary,
      post: req.body.post,
      picture: req.body.picture,
    };

    const data = await User.findOneAndUpdate(
      { _id: user._id },
      { $push: { userInfo: info } },
      { new: true }
    );
    res.status(200).send(data);
  },

  deleteData: async (req, res) => {
    const user = req.user;
    const data = await User.findOneAndUpdate(
      { _id: user._id },
      { $pull: { userInfo: { _id: req.body.employeeid } } },
      { new: true }
    );
    res.status(200).send(data);

    // Another way of doing it

    // const employeeid = req.body.employeeid;
    // const employees = user.userInfo;

    // const remainEmployees = employees.filter((employee) => {
    //   console.log(employee._id, "  :  ", employeeid);
    //   return employee._id != employeeid;
    // });
    // const data = await User.findByIdAndUpdate(
    //   user._id,
    //   { userInfo: remainEmployees },
    //   { new: true }
    // );
    // res.status(200).send(data);
  },

  updateData: async (req, res) => {
    const user = req.user;

    const data = await User.findOneAndUpdate(
      { _id: user._id, "userInfo._id": req.body.employeeid },
      {
        $set: {
          "userInfo.$.name": req.body.name,
          "userInfo.$.email": req.body.email,
          "userInfo.$.phone": req.body.phone,
          "userInfo.$.salary": req.body.salary,
          "userInfo.$.post": req.body.post,
          "userInfo.$.picture": req.body.picture,
        },
      },
      { new: true }
    );
    res.status(200).send(data);
  },
  deleteAccount: async (req, res) => {
    const user = req.user;
    const data = await User.findOneAndDelete({ _id: user._id });
    res.status(200).send(data);
  },
};
