const { Op } = require("sequelize")
const auth = require("../auth/auth")
const { tagebuch } = require("../datenquelle/db/db")



module.exports = (app)=>{
    app.get("/:id", auth, (req, res)=>{
        if(req.query.B || req.query.M || req.query.T  || req.query.J )
        {
            const Tag = req.query.T || ""
            const jahr = req.query.J || ""
            const monat = req.query.M || ""
            const bezug = req.query.B || ""
            tagebuch.findAndCountAll({where: {[Op.or]:[{Bezug : bezug}]}})
             .then(Eintrage =>{
                if(Eintrage.count < 1)
                {
                    const nachricht = "Keiner Eintrang wurde gefunden"
                    res.status(200).json(nachricht)
                }
                else if(Eintrage.count == 1)
                {
                    const nachricht = `${Eintrage.count} Eintrag wurde gefunden`
                    const rows = Eintrage.rows
                    rows.map(t =>{
                        console.log(t)
                    })
                    res.status(200).json({nachricht, Eintrage: Eintrage.rows})
                }
                else
                {
                    const nachricht = `${Eintrage.count} Einträge wurden gefunden`
                    rows.map(t =>{
                        console.log(t)
                    })
                    res.status(200).json({nachricht, Eintrage : Eintrage.rows})
                }
             })
             .catch(Fehler =>{
                if(Fehler)
                {
                    res.status(500).json(Fehler)
                }
                else
                {
                    res.status(500).json("Fehler des Servers")
                }
             })
        }
        else
        {
            tagebuch.findAndCountAll()
             .then(Eintrage =>{
                if(Eintrage.count < 1)
                    {
                        const nachricht = "Keiner Eintrang wurde gefunden"
                        res.status(200).json(nachricht)
                    }
                    else if(Eintrage.count == 1)
                    {
                        const nachricht = `${Eintrage.count} Eintrag wurde gefunden`
                        console.log(Eintrage.rows)
                        res.status(200).json({nachricht, Eintrage: Eintrage.rows})
                    }
                    else
                    {
                        const nachricht = `${Eintrage.count} Einträge wurden gefunden`
                        console.log(Eintrage.rows)
                        res.status(200).json({nachricht, Eintrage : Eintrage.rows})
                    }
                 })
                 .catch(Fehler =>{
                    if(Fehler)
                    {
                        res.status(500).json(Fehler)
                    }
                    else
                    {
                        res.status(500).json("Fehler des Servers")
                    }
             })
        }
    })
}