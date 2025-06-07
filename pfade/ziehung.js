const { UniqueConstraintError, ValidationError } = require("sequelize")
const auth = require("../auth/auth")
const {Series, Wahlen} = require("../datenquelle/db/db")
const { option5 } = require("./options")
const algorithme = require("./algorithme")
const mailer = require("nodemailer")
require("dotenv").config()
const transporter = mailer.createTransport({
    service : "gmail",
    user : "smtp.gmail.com",
    port : 587,
    secure : false,
    auth:
    {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
})
module.exports = (app)=>{
    app.post("/benutzer/:id/ziehung",auth,(req, res)=>{
        const codewahl = req.body.codewahl
        Series.findOne({where:{codewahl:codewahl, bezahlung: true}})
         .then((serie)=>{
            if(serie)
            {
                Wahlen.findAndCountAll({where:{codewahl:codewahl}})
             .then((series, count)=>{
                var Liste = []
                for(i=0; i<series.count; i++)
                    {
                        var w = series.rows[i].wahl.split(",")
                        for(j = 0; j < w.length ; j++)
                        {
                            Liste.push(w[j])
                        }
                    }
                    console.log(Liste)
                    var empfänger = serie.Teilnehmer.split(";")
                    empfänger.push(["alfredmunganga@icloud.com"])
                    empfänger = empfänger.join(",")
                    var un = serie.ziffer.split("")
                    var HT = option5(codewahl, empfänger, algorithme(Liste, 12),algorithme(un, 1), series.count)
                    transporter.sendMail(HT, (err)=>{
                        if(err)
                            {
                                console.log(err)
                                res.status(500).json(err)
                            }
                        else
                        {
                            console.log("Ende ok")
                            const nachricht = "Der Lottospiel wurde erfolgreich abgeschlosssen, die Zeugnisse erhalten Sie per Mail "
                            res.status(200).json(nachricht)
                        }
                    })
             })
             .catch((err)=>{
                console.log(err)
                res.status(500).json(err)
             })
            }
            else
            {
                res.status(401).json("Es gibt keinen Lottospiel mit diesem Code")
            }
            
         })
         .catch((err)=>{
            console.log(err)
            res.status(500).json(err)
         })


    })
}