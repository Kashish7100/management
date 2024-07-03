const { exec } = require('child_process')

const commands = [
  'npx sequelize-cli db:drop',
  'npx sequelize-cli db:create',
  'npx sequelize-cli db:migrate',
  'npx sequelize-cli db:seed:all',
]

if (process.argv.includes('dev')) {
  commands.push(
    'npx sequelize-cli db:seed:all --seeders-path seeders/dev --env development',
  )
}

const runCommands = async () => {
  for (const command of commands) {
    console.log(`Running: ${command}`)
    await new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${stderr}`)
          reject(error)
        } else {
          console.log(`Output: ${stdout}`)
          resolve()
        }
      })
    })
  }
  console.log('All commands executed successfully')
}

runCommands().catch((error) => {
  console.error('Failed to execute commands:', error)
  process.exit(1)
})
