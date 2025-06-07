require("dotenv").config()
const {option1, option2} = require("./options")
const {option4} = require("../options")
const stripe = require("stripe")(process.env.PRIVATE_KEY)
const express = require("express")
const mailer = require("nodemailer")
const {Wahlen, Series} = require("../../datenquelle/db/db")
const { errorMonitor } = require("nodemailer/lib/xoauth2")
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
  app.post("/webhook",express.raw({type: 'application/json'}),async (req, res)=>{
    const sig = req.headers['stripe-signature'];
    const body = req.body
    const e = "whsec_6tJGlxIeJwkw4ePI8CGxnQ9ozS3UGefh"
    let event 
    try {
        event = stripe.webhooks.constructEvent((body.toString()), sig, e)
    } catch (error) {
        console.log("n")
        res.status(400).send(error)
        return
    }
    if(event.type == "checkout.session.completed")
    {
        const kunde = event.data.object.customer_details
        console.log(event)
        const mail = event.data.object.metadata.mail
        const codewahl = event.data.object.metadata.codewahl
        Wahlen.update({bezahlung : true}, {where: {codewahl: codewahl, Email : mail}})
         .then(()=>{
            Wahlen.findAndCountAll({where:{bezahlung : true}})
             .then((series, c)=>{
                if(series.count == 20)
                    {
                        Series.findOne({where:{codewahl:codewahl}})
                         .then(serie=>{
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
                                var un = serie.ziffer.split(",").pop()
                                var HT = option4(codewahl,empfänger,algorithme(Liste, 12),algorithme(un, 1),serie.Teilnehmer)
                                transporter.sendMail(HT, (err)=>{
                                    if(err)
                                        {
                                            res.status(500).json(err)
                                        }
                                    else{
                                        console.log(event.data)
                                        res.status(200).json(kunde)
                                    }
                                })
                            
                         })
                         .catch(err=>{
                            res.statu(500).json(err)
                         })
                    }
                else
                {
                    transporter.sendMail(option1("alfredmunganga@icloud.com", mail, series.count), (err)=>{
                        if(err)
                        {
                            res.staus(500).json(err)
                        }
                        else{
                            res.status(200).json(kunde)
                        }
                    })

                }
             })
             .catch(err=>{
                res.status(500).json(err)
             })
         })
         .catch(err=>{
            res.status(500).json(err)
         })
    }

})
}