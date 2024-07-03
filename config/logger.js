const winston = require('winston')
const path = require('path')
const fs = require('fs')

// Function to create the log directory if it does not exist
const createLogDirectory = () => {
  const logDirectory = path.join(__dirname, '..', 'log') // Root path + log folder
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory)
  }
}

// Custom function to generate log file name based on date and log level
const dateFilename = (level) => {
  createLogDirectory() // Ensure log directory exists
  const now = new Date()
  const datePart = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`

  if (level === 'error') {
    return path.join(__dirname, '..', 'log', `${datePart}-error.log`) // Root path + log folder + error log file
  } else {
    return path.join(__dirname, '..', 'log', `${datePart}.log`) // Root path + log folder + info log file
  }
}

// Configure Winston logger with timestamp and log files based on date and log level
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`
    }),
  ),
  transports: [
    new winston.transports.File({
      filename: dateFilename('error'), // Specify the filename directly for error logs
      level: 'error',
    }),
    new winston.transports.File({
      filename: dateFilename('info'), // Specify the filename directly for info logs
      level: 'info',
    }),
  ],
})

module.exports = logger
