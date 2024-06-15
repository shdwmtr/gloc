# LOC Counter
A simplistic web wrapper for [codetabs loc](https://github.com/jolav/codetabs/tree/master/loc).

![Endpoint Badge](https://img.shields.io/endpoint?url=https%3A%2F%2Floc-counter.onrender.com%3Frepo%3DShadowMonster99%2FLOC-Counter%26branch%3Dmaster%26ignored%3Dpnpm-lock.yaml%2CREADME.md%2Cpackage.json%2C.gitignore%26stat%3Dlines)


## Setup
the live build is at https://loc-counter.onrender.com/



| Parameter Name | Description                     | Optional | Default Value |
| -------------- | ------------------------------- | -------- | ------------- |
| `repo`       | repository in `owner/repo` format | ❌       | -             |
| `vendor`       | github or gitlab          | ✅      | `github`    |
| `ignored`       | relative path or file to exclude from count. comma seperated           | ✅       | -             |
| `branch`       | target branch          | ✅      | `master`    |
| `languages`       | whitelisted languages to count. to find langauge strings, go to [count loc](https://codetabs.com/count-loc/count-loc-online.html), put in your repo details, go to network tab in inspector, find the api request and open it in a new tab. you'll see all the available languages in your repo.           | ✅       | -             |
| `stat`       | specificy what to count. input types are `linesOfCode`, `comments`, `blanks`, `lines`, `files`           | ✅       | `linesOfCode`             |

> [!IMPORTANT]  
> Remember to properly url encode your request otherwise special characters wont work.

## Example 
https://loc-counter.onrender.com?repo=ShadowMonster99/LOC-Counter&branch=master&ignored=pnpm-lock.yaml,README.md,package.json,.gitignore&stat=lines


# Using in Markdown

head over to https://shields.io/badges/endpoint-badge and put your LOC counter url as the query url.

You can then use the generated badge in markdown!

> [!NOTE]  
> You can also override any of the properties in the schema by adding them as an extra query param in the result url
