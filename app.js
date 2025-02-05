const express = require("express")
const app = express()
const cors = require("cors")
require("dotenv").config()
const body_parser = require("body-parser")
const {sync} = require("./datenquelle/db/db")


sync()
app.use(body_parser.json())
app.use(cors())
app.listen(20008, ()=>{
    console.log("http://localhost:20000")
})
require("./pfade/registierung")(app)
require("./pfade/anmeldung")(app)
require("./pfade/Series")(app)
require("./pfade/ziehung")(app)
require("./pfade/wahlen")(app)