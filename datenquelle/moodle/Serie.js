module.exports = (db, Dat)=>{
    return db.define("wahlenserie", {
        id: {
            type : Dat.INTEGER,
            primaryKey : true,
            autoIncrement : true,
            allowNull : false
        },
        Emails : {
            type : Dat.STRING,
            allowNull : false,
            validate : {
                notEmpty : {nachrichte : "Die E-Mails muss gegeben werden"},
                notNull : {nachrichte : "Die E-Mail darf nicht leer sein"}
            }
        },
        Teilnehmer : {
            type : Dat.STRING,
            allowNull : false,
            validate : {
                notEmpty : {nachrichte : "Die E-Mails muss gegeben werden"},
                notNull : {nachrichte : "Die E-Mail darf nicht leer sein"}
            }
        },
        codewahl: {
            type : Dat.INTEGER,
            allowNull : false,
            unique : {nachrichte : "Es gibt schon einen ähnlichen Code"},
            validate:{
                notEmpty : {nachrichte : "Ein Code muss gegeben werden"},
                notNull : {nachrichte : "Der Code darf Keine Null sein"},
            }
        },
        ziffer : {
            type : Dat.STRING,
            allowNull: false,
        }
    },
    {
        timestamps : true,
        createdAt : "Herstellung",
        updatedAt : "Update"
    }
)
}