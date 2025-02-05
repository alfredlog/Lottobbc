const {Sequelize, DataTypes} = require("sequelize")
const benutzer = require("../moodle/benutzer")
const Serie = require("../moodle/Serie")
const wahl = require("../moodle/wahl")
require("dotenv").config()
const Db = new Sequelize(process.env.POSTGRES_URLV_URL, {dialectModule: require("pg")})

const Series = Serie(Db, DataTypes)
const Benutzer = benutzer(Db, DataTypes)
const Wahlen = wahl(Db, DataTypes)
sync =()=>{
    Db.sync()
     .then(()=>{
        console.log("Connecter")
     })
}

module.exports = {Benutzer, sync, Series, Wahlen}