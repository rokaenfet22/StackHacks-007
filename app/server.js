//Extract Modules
const express = require("express")
const body_parser = require("body-parser")

//Immediate use of modules
const app = express()
app.use(express.static("./app/client")) //serving static files from /client dir
app.use(express.json()) //Parsing json-encoded bodies

app.listen("8080")
console.log("Server running at http://127.0.0.1:8080/")