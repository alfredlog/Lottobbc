const { UniqueConstraintError, ValidationError } = require("sequelize")
const auth = require("../auth/auth")
const {Benutzer, Series} = require("../datenquelle/db/db")
const mailer = require("nodemailer")
const {option1, option2} = require("./options")

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
    app.post("/benutzer/:id/series",auth, (req, res) =>{
        const id = req.params.id
        const Emails = req.body.Emails
        const codewahl = req.body.codewahl
        Benutzer.findOne({where: {id : id}})
         .then(benutzer =>{
            if(benutzer)
            {
                Series.create({
                    Emails : Emails+";exemple@gmail.com",
                    Teilnehmer : Emails,
                    codewahl : codewahl,
                    ziffer : ""
                })
                .then(()=>{
                    const Mails = Emails.split(";")
                    for(i=0; i< Mails.length; i++)
                        {
                            const Teilnehmer = option1(codewahl, Mails[i], "https://lottobbc.vercel.app/wahl.html")
                            transporter.sendMail(Teilnehmer, (err)=>{
                                if(err)
                                    {
                                        console.log(err)
                                        res.status(500).json(err)
                                    }
                                else{
                                    console.log("Teilnemer Ok")
                                }
                            })
                        }
                    const Hersteller = option2(codewahl, benutzer.email, Emails)
                    transporter.sendMail(Hersteller, (err)=>{
                        if(err)
                            {
                                console.log(err)
                                res.status(500).json(err)
                            }
                        else
                        {
                            console.log("Teilnehmer ok")
                            const nachricht = "Der Lottospiel wurd erfolgreich hergestellt"
                            res.status(200).json(nachricht)
                        }
                    })
                    
                })
                .catch(fehler =>{
                    if(fehler instanceof UniqueConstraintError)
                    {
                        const nachrichte = "es gibt schon ein ähnliches code"
                        res.status(400).json(nachrichte)
                    }
                    else if( fehler instanceof ValidationError)
                        {
                            res.status(400).json(fehler.errors)
                        }
                })
            }
         })
         .catch(()=>{
            res.status(500).json({nachricht : "Fehler des Servers"})
         })
    })
}
