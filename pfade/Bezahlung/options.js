
const option1 = (mail,Email,n)=>{
    return {
        from : process.env.MAIL,
        to : mail,
        subject : "der erhalt der Bezahlung eines Teilnehmers",
        text : `der Teilnehmer ${Email} hat bezahlt \n Daher betägt die Anzhl der Teilnehmer, die bezahlt haben ${n} `,
        
    }
}
const option2 = (sold, mail, adresse, artikel, mail2, livraison)=>{
    return {
        from : process.env.MAIL,
        to : mail,
        subject : "eine neue Bestellung",
        text : `Sie haben eine neue Bestellung von ${mail2} erhalten \nAlle Informationen :
        \nArtikel : ${artikel}
        \nBetrag : ${sold}
        \nAdresse : ${adresse}
        \nBedingung der lieferung : ${livraison || "Kostetlos, zwischen 5 tagen und einer woche"}`,
        
    }
}

module.exports = {option1, option2}