module.exports = {
  mongoURL: process.env.mongoURL,
  JWT_SECRET: process.env.JWT_SECRET,
  oauth: {
    google: {
      clientID: process.env.GOOGLE_CLIENT_ID, // For Web
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    facebook: {
      clientID: process.env.FB_CLIENT_ID,
      clientSecret: process.env.FB_CLIENT_SECRET,
    },
  },
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
};
