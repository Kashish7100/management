const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require('passport')
const routes = require('./routes')
const logger = require('./config/logger')
const multer = require('multer')

const app = express()

const db = require('./models')

var corsOptions = {
  origin: [
    '*'
  ],
}

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


app.use('/uploads', express.static('uploads'))
// /////////////////////////////////////////////

// app.js

// Log an info message
logger.info('The server has started and running in port 4200')

// set port, listen for requests
const PORT = process.env.PORT || 4200
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
