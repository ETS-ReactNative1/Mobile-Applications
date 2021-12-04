const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const { mongoURL } = require('./configuration/index')

// mongoose.connect("mongodb://localhost/APIAuthentication", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connection established.'))
  .catch((error) => console.log('Error in connecting to mongoDB : ', error))

const app = express()

//Middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())

//Routes

//http://localhost:3000/users/
//http://localhost:3000/users/signup
//http://localhost:3000/users/signin
//http://localhost:3000/users/secret

app.use('/users', require('./routes/users'))

//Start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`server is listening on port ${port}`)
})
