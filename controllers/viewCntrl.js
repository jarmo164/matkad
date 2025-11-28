import { getAllHikes, getHikeById, addRegistration } from '../model/hikes.js'

export function indexCntrl(request, response) {
    const matkadArray = getAllHikes()
    response.render("index", { matkad:matkadArray })
}

export function kontaktCntrl(request, response) {
    response.render("kontakt")
}

export function matkDetailCntrl(request, response) {
    const matkId = parseInt(request.params.id)
    const matk = getHikeById(matkId)
    if (!matk) {
        return response.status(404).send('Matka ei leitud')
    }
    
    response.render("matk", { matk })
}

export function uudisedCntrl (request, response) {
    const uudised = [
        {
            pilt: "https://picsum.photos/300/200?random=1",
            pealkiri: "Uus hooaeg algab võidukalt",
            kokkuvote: "Meie klubi esindusmeeskond alustas uut hooaega suurepärase võiduga koduväljakul. Fännide toetus oli meeletu ja mängijad andsid endast parima."
        },
        {
            pilt: "https://picsum.photos/300/200?random=2",
            pealkiri: "Noortetreeningute ajad muutuvad",
            kokkuvote: "Alates järgmisest kuust toimuvad noortetreeningud uutel kellaaegadel. Palume kõigil lapsevanematel tutvuda uue graafikuga kodulehel."
        },
        {
            pilt: "https://picsum.photos/300/200?random=3",
            pealkiri: "Klubi suvepäevad tulekul",
            kokkuvote: "Ootame kõiki klubiliikmeid ja nende peresid osalema iga-aastastel suvepäevadel. Kavas on sportlikud mängud, grillimine ja palju muud põnevat."
        },
        {
            pilt: "https://picsum.photos/300/200?random=4",
            pealkiri: "Uus sponsorleping allkirjastatud",
            kokkuvote: "Meil on hea meel teatada, et sõlmisime koostöölepingu uue peasponsoriga, mis aitab meil veelgi paremaid tulemusi saavutada."
        },
        {
            pilt: "https://picsum.photos/300/200?random=5",
            pealkiri: "Vabatahtlike otsing",
            kokkuvote: "Otsime oma meeskonda aktiivseid vabatahtlikke, kes aitaksid korraldada kodumänge ja muid üritusi. Tule ja löö kaasa!"
        },
        {
            pilt: "https://picsum.photos/300/200?random=6",
            pealkiri: "Aasta parim mängija valitud",
            kokkuvote: "Eelmise hooaja parimaks mängijaks valiti meie ründaja, kes lõi hooaja jooksul rekordarvu väravaid. Palju õnne!"
        }
    ];
    response.render("uudised", { uudised: uudised });
}
export function registerHikeCntrl(request, response) {
    const matkId = parseInt(request.params.id)
    if (!matkId) {
        return response.status(400).send('Matka ei leitud')
    }
    const nimi = request.query.nimi
    const email = request.query.email
    
    //andmete valideerimine
    const lisatud = addRegistration(matkId, nimi, email)
    if (!lisatud) {
        response.render("matk", { matk: getHikeById(matkId), error:"Ei õnnestunud lisada registreerumist", success: null })
        return
    }
    
    response.render("matk", { matk: getHikeById(matkId), error: null, success:"Registreerumine õnnestunud" })
}
