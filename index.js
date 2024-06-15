const express = require('express')
const Router = express()
const PORT = process.env.PORT || 3000

function CalculateLinesOfCode(request, json)
{
    if (json?.Error)
    {
        return {
            schemaVersion: 1, label: "lines", message: json?.Error
        }
    }

    const whitelistedFiles = request?.query?.languages?.split(",");

    const totalLines = json.reduce((acc, file) => {

        if (whitelistedFiles)
        {        
            return whitelistedFiles.includes(file.language) ? acc + file.linesOfCode : acc;
        }

        return acc + file.linesOfCode;

    }, 0);

    return {
        schemaVersion: 1, label: "lines", message: String(totalLines)
    }
}

function ConstructMessageURI(request) 
{
    const params = request.query
    const repository = params?.repo

    if (!repository) 
    {
        throw Error("missing query paramter 'repo'")
    }

    const vendor = params?.vendor ?? "github"
    const branch = params?.branch ?? "master"
    const ignoredItems = params?.ignored ?? String()

    const baseUrl = new URL('https://api.codetabs.com/v1/loc/');

    const searchParams = new URLSearchParams({
        [vendor]: repository,
        ignored: ignoredItems,
        branch: branch
    });

    baseUrl.search = searchParams
    return baseUrl.toString()
}

Router.get('/', (request, response) => 
{
    try
    {
        const requestUrl = ConstructMessageURI(request)

        fetch(requestUrl).then(text => text.json()).then(json => 
        {
            response.json(CalculateLinesOfCode(request, json))
        })
    }
    catch (exception)
    {
        response.json({exception: exception.toString()})
    }
})

Router.listen(PORT, () => console.log(`listening on ${PORT}`))