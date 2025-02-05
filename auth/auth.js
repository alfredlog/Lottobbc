const jwt = require("jsonwebtoken")
const key = require("../auth/key")

module.exports = (req, res, next)=>{
    const authoriz = req.headers.authoriz
    //const authoriz = autho.split(" ")[1]
    const id = req.params.id
    jwt.verify(authoriz, key, (fehler, richtig)=>{
        if(richtig)
        {
            if(id && id != richtig.userId)
            {
                const nachrichte = "Das ID stimmt nicht"
                res.status(400).json(nachrichte)
            }
            else
            {
                next()
            }
        }
        else if(fehler)
        {
            res.status(401).json(fehler)
        }
    })
}