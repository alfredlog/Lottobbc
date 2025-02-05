module.exports = (Liste, nm)=>{
var n
var choix = []
var nombre = []
var Dic = new Map()
for(i=0; i< Liste.length; i++)
    {
        n = 0
        for(j=0; j< Liste.length; j++)
            {
                if(Liste[i] == Liste[j])
                    {
                        n++
                    }
            }
            choix.push(Liste[i])
            nombre.push(n)
            Liste = Liste.filter((e) => e !== (Liste[i]))
            i = -1
    }
var max = 1
var reponse = []
while(max >= 1)
{
    max = Math.max(...nombre)
    for(i=0; i< nombre.length; i++)
    {
        if(nombre[i] == max && max !== 0)
        {
            reponse.push(choix[i])
            nombre[i] = 0
        }
    }
}
var Ziffer = []
for(i=0; i<nm; i++)
    {
        Ziffer.push(reponse[i])
    }
return Ziffer
}



