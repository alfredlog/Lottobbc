
require("dotenv").config()
const stripe = require("stripe")(process.env.PRIVATE_KEY)

module.exports = async(codewahl, mail)=>{
        try
        {
           const session = await stripe.checkout.sessions.create({
                    line_items:[
                      {
                        price_data : {
                          currency : "eur",
                          product_data :{
                              name : "Lotto",
                              description: "DR Kongo gemeinde"
                          },
                          unit_amount : 6117
                        },
                        quantity : 1,
                      }
                    ],
                    mode: 'payment',
                    success_url:'http://localhost:2000/success.html',
                    cancel_url:'http://localhost:2000/cancel.html',
                    metadata : {
                      codewahl : codewahl,
                      mail : mail
                    },
             })
            console.log("ok")
            return session
        }
        catch(b)
        {
            return b
        }
}
