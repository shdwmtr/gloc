const express = require('express')
const Router = express()
const PORT = process.env.PORT || 3000

function calculateLinesOfCode(request, json) {

    if (json?.Error) return { schemaVersion: 1, label: "lines", message: json?.Error } 
    const whitelistedFiles = request?.query?.languages?.split(",");
    const targetStatistic = request?.query?.stat ?? "linesOfCode"

    return { schemaVersion: 1, label: "lines", message: String(
        json.reduce((acc, file) => {
            if (file.language == "Total") return acc
            if (whitelistedFiles) {        
                return whitelistedFiles.includes(file.language) ? acc + (file?.[targetStatistic] ?? 0) : acc;
            }
            return acc + (file?.[targetStatistic] ?? 0);
        }, 0)
    ) }
}

function constructMessageURI(request) {

    const params = request.query
    const repository = params?.repo

    if (!repository) {
        throw Error("missing query paramter 'repo'")
    }

    const vendor = params?.vendor ?? "github", branch = params?.branch ?? "master", ignoredItems = params?.ignored ?? String()

    const baseUrl  = new URL('https://api.codetabs.com/v1/loc/');
    baseUrl.search = new URLSearchParams({ [vendor]: repository, ignored: ignoredItems, branch: branch });
    return baseUrl.toString()
}

Router.get('/', (request, response) => {
    try {
        fetch(constructMessageURI(request)).then(text => text.json()).then(json => {
            response.json(calculateLinesOfCode(request, json))
        })
    }
    catch (exception) {
        response.json({exception: exception.toString()})
    }
})

Router.listen(PORT, () => console.log(`listening on ${PORT}`))