const { UniqueConstraintError, ValidationError, where } = require("sequelize")
const auth = require("../auth/auth")
const {Benutzer, Series, Wahlen} = require("../datenquelle/db/db")
const mailer = require("nodemailer")
const {option3, option4, option6} = require("./options")
const algorithme = require("./algorithme")

const transporter = mailer.createTransport({
    service : "gmail",
    user : "smtp.gmail.com",
    port : 587,
    secure : false,
    auth:
    {
        user: process.env.MAIL,
        pass: process.env.PASS
    }
})
module.exports = (app)=>{
    app.post("/wahlen",(req, res) =>{
        const Email = req.body.Email
        const codewahl = req.body.codewahl
        const wahl = req.body.wahl
        const ziffer = req.body.ziffer
        Series.findOne({where: {codewahl : codewahl}})
         .then(serie =>{
            if(serie)
            {
                if((Email !== "exemple@gmail.com" && serie.Emails.split(";")).includes(Email))
                    {
                        Wahlen.create({
                            Email : Email,
                            codewahl : codewahl,
                            wahl : wahl
                        })
                        .then(()=>{
                            Series.update({ziffer : (serie.ziffer += `${ziffer}` )}, {where : {codewahl:codewahl}})
                             .then(()=>{
                                Wahlen.findAndCountAll({where:{codewahl : codewahl}})
                             .then((series, count)=>{
                                if(series.count == 20)
                                    {
                                        var Liste = []
                                        for(i=0; i<20; i++)
                                            {
                                                var w = series.rows[i].wahl.split(",")
                                                for(j = 0; j < w.length ; j++)
                                                    {
                                                        Liste.push(w[j])
                                                    }
                                                
                                            }
                                            var empfänger = serie.Teilnehmer.split(";")
                                            empfänger.push(["alfredmunganga@icloud.com"])
                                            empfänger = empfänger.join(",")
                                            const Hersteller = option4(codewahl,empfänger,algorithme(Liste, 20), algorithme(serie.ziffer.split(""), 1) )
                                            transporter.sendMail(Hersteller, (err)=>{
                                                if(err)
                                                    {
                                                        console.log(err)
                                                        res.status(500).json(err)
                                                    }
                                                else
                                                {
                                                    console.log("Ende ok")
                                                    const nachricht = "Der Lottospiel wurde erfolgreich abgeschlosssen"
                                                    const data = serie.Emails.split(";").filter((e=>e !== Email))
                                                    Series.update({Emails : data.join(";")}, {where:{codewahl: codewahl}})
                                                     .then(()=>{
                                                        res.status(200).json(nachricht)
                                                     })
                                                     .catch((err)=>{
                                                        res.status(500).json(err)
                                                    })
                                                }
                                            })
                                    }
                                else
                                {
                                    var Emails = []
                                    for(i=0; i<series.rows.length;i++)
                                        {
                                            Emails.push(series.rows[i].Email)
                                        } 
                                    const Hersteller = option3(codewahl, "alfredmunganga@icloud.com",Emails , series.count)
                                    transporter.sendMail(Hersteller, (err)=>{
                                        if(err)
                                            {
                                                console.log(err)
                                                res.status(500).json(err)
                                            }
                                        else
                                        {
                                            console.log("Ende ok")
                                            const nachricht = "Der Lottospiel wurde erfolgreich aktualisiert"
                                            const data = serie.Emails.split(";").filter((e=>e !== Email))
                                            Series.update({Emails : data.join(";")}, {where:{codewahl: codewahl}})
                                             .then(()=>{
                                                res.status(200).json(nachricht)
                                             })
                                             .catch((err)=>{
                                                res.status(500).json(err)
                                            })
                                        }
                                    })
                                }
                             })
                             })
                             .catch((err)=>{
                                console.log(err)
                                res.status(500).json(err)
                             })
                        })
                        .catch(fehler =>{
                            if(fehler instanceof UniqueConstraintError || ValidationError)
                            {
                                console.log(fehler)
                                res.status(400).json(fehler)
                            }
                        })
                    }
                else
                {
                    if(serie.Teilnehmer.split(";").includes(Email))
                    {
                        const nachricht = `Du hast schon deine Nummer für den Spiel ${codewahl} eingeben`
                        res.status(400).json(nachricht)
                    }
                    else
                    {
                        const nachricht = `Du bist kein Teilnemer an dem Spiel  ${codewahl}`
                        res.status(400).json(nachricht)
                    }
                }
                
            }
            else
            {
                const nachricht = `Es gibt keinen Spiel  ${codewahl}`
                res.status(400).json(nachricht)
            }
         })
         .catch(()=>{
            res.status(500).json({nachricht : "Fehler des Servers"})
         })
    })
}