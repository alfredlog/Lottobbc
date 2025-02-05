module.exports = (sequelize, Datatype)=>{
    return sequelize.define("adminbbc", {
        id: {
            type : Datatype.INTEGER,
            primaryKey : true,
            autoIncrement : true,
        },
        name : {
            type : Datatype.STRING,
            allowNull : false,
            unique: { nachrichte : "Es gibt schon einen Benutzer mit diesem Namen, Bitte geben Sie einen anderen Namen oder melden Sie an, fals Sie sich schon regietiert haben"},
            validate : {
                notEmpty : {nachrichten : "Der name muss ausgefüllt werden"},
                notNull : {nachrichte : "Der name darf keine Null sein"}
            }
        },
        email : {
            type : Datatype.STRING,
            allowNull : false,
            unique : { nachrichte : "Diese Mail wurde schon genutzt"},
            validate : {
                notEmpty : { nachrichte : " Der name muss ausgefüllt werden"},
                notNull : {nachricte : " Der name darf keine Null sein"},
                isEmail : {nachrichte : "Du muss eine E-Mail angeben"}
            }
        },
        passwort: {
            type : Datatype.STRING,
            allowNull : false,
            unique: { nachrichte : " Diese passwort gehört einem anderen Benutzer"},
            validate : {
                len : {
                    args : [8, 2000],
                    nachrichte : "Dein Passwort muss zwischen 8 und 20 charakter haben",
                },
                notEmpty : {nachrichte : " Das Passwort muss ausgefüllt werden"},
                notNull : { nachrichte : "das Passwort darf keine null sein"}
            }
        }
    })
}