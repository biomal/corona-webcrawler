import readline from "readline"

import * as newsController from "./controllers/news"
import * as covidSpController from "./controllers/coronavirus-sp"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

console.clear()
console.log('Please select one of the options below:')
console.log('1 - Gather covid-19 local news')
console.log('2 - Download official covid-19 data from sp.gov')

const ask = () => {
  rl.question('Enter an option: ', answer => {
    const option = parseInt(answer)
    switch (option) {
      case 1:
        console.clear()
        rl.close()
        newsController.run()
        break
      case 2:
        console.clear()
        rl.close()
        covidSpController.run()
        break
      default:
        console.log('Invalid option, please try again.')
        ask()
    }
  })
}

ask()