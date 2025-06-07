module.exports = (db, Dat)=>{
    return db.define("Wahlen", {
        id: {
            type : Dat.INTEGER,
            primaryKey : true,
            autoIncrement : true,
            allowNull : false
        },
        Email : {
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
            validate:{
                notEmpty : {nachrichte : "Ein Code muss gegeben werden"},
                notNull : {nachrichte : "Der Code darf Keine Null sein"},
            }
        },
        bezahlung :{
            type : Dat.BOOLEAN,
            allowNull : false,
        },
        wahl : {
            type : Dat.STRING,
            allowNull : false,
            validate : {
                notEmpty: {},
                notNull : {},
                isnummer(Value){
                    var v = Value.split(",")
                    for(i=0; i < v.length; i++)
                        {
                            if(v[i]>49 || v[i] < 1)
                                {
                                    throw new Error("alle gegebenen nummer muss in dem Intervall von 1 bis 49 sein")
                                }
                            
                        }
                    if(v.length !== 6)
                        {
                            throw new Error("Du muss 6 nummer geben")
                        }
                }
            },
        }
    },
    {
        timestamps : true,
        createdAt : "Herstellung",
        updatedAt : "Update"
    }
)
}