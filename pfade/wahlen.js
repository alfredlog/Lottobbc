const { UniqueConstraintError, ValidationError, where } = require("sequelize")
const auth = require("../auth/auth")
const {Benutzer, Series, Wahlen} = require("../datenquelle/db/db")
const mailer = require("nodemailer")
const {option3, option4, option6} = require("./options")
const algorithme = require("./algorithme")
const checkout = require("./Bezahlung/checkout")

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
                            wahl : wahl,
                            bezahlung : false
                        })
                        .then(()=>{
                            Series.update({ziffer : (serie.ziffer += `${ziffer},` )}, {where : {codewahl:codewahl}})
                             .then(()=>{
                                Wahlen.findAll({where:{codewahl : codewahl}})
                             .then(async(wahlen)=>{
                                let Emails = []
                                wahlen.map((x)=>{
                                    Emails.push(x)
                                })
                                const link = await checkout(codewahl, Email)
                                transporter.sendMail(option6(Email, ziffer, wahl,link.url, codewahl), (err)=>{
                                    if(err)
                                        {
                                            res.status(500).json(err)
                                        }
                                    else{
                                        console.log(link)
                                        res.status(200).json({nachrichte : "alles wird erfolgreich elerdigt", url : link.url})
                                    }
                                })
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