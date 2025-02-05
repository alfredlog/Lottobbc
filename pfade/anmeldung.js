const jwt = require("jsonwebtoken")
const {Benutzer} = require("../datenquelle/db/db")
const bcrypt = require("bcrypt")
const key = require("../auth/key")

module.exports = (app)=>{
    app.post("/anmeldung", (req, res)=>{
        let mail = req.body.mail
        let passwort = req.body.passwort
        console.log(mail)
        Benutzer.findOne({where : {email : mail}})
         .then(benutzer =>{
            if(benutzer){
                bcrypt.compare(passwort, benutzer.passwort)
                .then(istPasswort =>{
                    if(istPasswort)
                    {
                        const token = jwt.sign({userId : benutzer.id},key,{expiresIn: "24h"})
                        const nachrichte = "Der Benutzer hat sich erfolgreich angemeldet"
                        res.status(200).json({nachrichte, token})
                    }
                    else
                    {
                        const nachrichte = "Das Passwort stimmt nicht"
                        res.status(400).json(nachrichte)
                    }
                } )
                .catch((fehler)=>{
                    console.log(fehler)
                    res.status(500).json("Fehler des Servers Bitte versuchen Sie später")
                })
            }
            else
            {
                const message = "Es gibt keinen Benutzer mit dieser E-Mail"
                res.status(400).json(message)
            }
         })
         .catch((fehler)=>{
            console.log(fehler)
            res.status(500).json("Fehler des Servers Bitte versuchen Sie später")
         })
    })
}