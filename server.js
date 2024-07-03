const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const pass = require('./config/passport')
const swaggerUI = require('swagger-ui-express')
const routes = require('./routes')
const logger = require('./config/logger')
const env = require('dotenv').config()

const app = express()

const db = require('./models')

var corsOptions = {
  origin: [
    '*',
    'http://localhost:3000',
    'http://localhost:4200',
  ],
}
// var corsOptions = {
//   origin: 'https://glcl-frontend.vercel.app',
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true, // Allow cookies to be sent with the request
// }

app.use(cors(corsOptions))
app.use(passport.initialize())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)

// parse requests of content-type - application/json
app.use(bodyParser.json())

// simple route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Node.js and sequelize application.',
  })
})

// Use the combined routes
app.use('/api', routes)

// Serve Swagger documentation
// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

app.use('/uploads', express.static('uploads'))
// /////////////////////////////////////////////

// app.js

// Log an info message
logger.info('The server has started and running in port 4200')

// set port, listen for requests
const PORT = process.env.PORT || 4200
// const PORT = process.env.PORT || 4300
// const IP_ADDRESS = '192.168.43.66';
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
// app.listen(PORT, IP_ADDRESS, () => {
//   console.log(`Server is running on http://${IP_ADDRESS}:${PORT}`);
// });
