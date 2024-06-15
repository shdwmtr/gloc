const express = require('express')
const Router = express()
const PORT = process.env.PORT || 3000

const CalculateLinesOfCode = (json) => {
  let lines = 0

  for (const i in json)
  {
    if (json[i].language == 'C Header' || json[i].language == "C++")
      lines += json[i].linesOfCode
  }

  return {
    schemaVersion: 1,
    label: "lines",
    message: String(lines)
  }
}

Router.get('/', (request, response) => 
{
  fetch("https://api.codetabs.com/v1/loc/?github=SteamClientHomebrew/Millennium&branch=main&ignored=vendor")
  .then(text => text.json())
  .then(json => {
    response.json(CalculateLinesOfCode(json))
  })
})

Router.listen(PORT, () => console.log(`listening on ${PORT}`))