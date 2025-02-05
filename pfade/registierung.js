const { UniqueConstraintError, ValidationError } = require("sequelize")
const {Benutzer} = require("../datenquelle/db/db")
const becrypt = require("bcrypt")
module.exports = (app)=>{
    app.post("/registierung", (req, res)=>{
        let name = req.body.name
        let mail = req.body.mail
        becrypt.hash(req.body.passwort, 10)
         .then(passwort =>{
            Benutzer.create({
                name : name,
                passwort: passwort,
                email : mail
            })
            .then(()=>{
                const nachricht = "Die registierung war erfolgreich"
                res.status(200).json(nachricht)
            })
            .catch(fehler => {
                if(fehler instanceof UniqueConstraintError){
                    res.status(400).json(fehler)
                }
                if(fehler instanceof ValidationError)
                {
                    res.status(400).json(fehler)
                }
                else
                {
                    res.status(500).json(fehler)
                }
            })
         })

    })
}