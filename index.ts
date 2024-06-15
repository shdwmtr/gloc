const Router = require('express')()
const PORT = process.env.PORT || 3000

interface ResponseProps
{
    schemaVersion?: number,
    label?: string, 
    message?: string,
    exception?: string
}

interface CodeTabProps
{
    [key: string]: any
    
    language: string,
    files: number,
    lines: number,
    blanks: number,
    comments: number,
    linesOfCode: number,
}

const ReduceItemProps = (responseBuffer: any, whitelistedFiles: Array<string>, targetStatistic: string): Number => {

    return responseBuffer.reduce((current: number, proposed: CodeTabProps) => {

        /** exclude total count as we want all individual components */
        if (proposed.language == "Total") 
            return current

        if (whitelistedFiles) {        
            return whitelistedFiles.includes(proposed.language) ? current + (proposed?.[targetStatistic] ?? 0) : current;
        }
        return current + (proposed?.[targetStatistic] ?? 0);

    }, 0)
}

const ParseResponse = (request: any, responseBuffer: any): ResponseProps => {

    if (responseBuffer?.Error) {
        return { schemaVersion: 1, label: "lines", message: responseBuffer?.Error } 
    }

    const whitelistedFiles: Array<string> = request?.query?.languages?.split(",");
    const targetStatistic: string         = request?.query?.stat ?? "linesOfCode"

    return { schemaVersion: 1, label: "lines", message: String(ReduceItemProps(responseBuffer, whitelistedFiles, targetStatistic)) }
}

const ConstructMessageURI = (request: any) => {

    const params = request.query
    const repository = params?.repo

    if (!repository) {
        throw Error("missing query paramter 'repo'")
    }

    const vendor = params?.vendor ?? "github", branch = params?.branch ?? "master", ignoredItems = params?.ignored ?? String()

    const baseUrl  = new URL('https://api.codetabs.com/v1/loc/');
    baseUrl.search = new URLSearchParams({ [vendor]: repository, ignored: ignoredItems, branch: branch }).toString();
    return baseUrl.toString()
}


const CalculateLinesOfCode = async (request: any): Promise<ResponseProps> => {
    return new Promise((resolve, reject) => {
        try {
            fetch(ConstructMessageURI(request)).then(text => text.json()).then(json => {
                resolve(ParseResponse(request, json))
            })
        }
        catch (exception: any) {
            resolve({ exception: exception.toString() })
        }
    })
}


Router.get('/', async (request: any, response: any) => response.json(await CalculateLinesOfCode(request)))
Router.listen(PORT, () => console.log(`listening on ${PORT}`))