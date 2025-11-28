import { getAllHikes, getHikeById } from '../model/hikes.js'

export function returnAllHikesCntrl(request, response) {
    const matkad = getAllHikes()
    response.json(matkad.map(matk => ({
        id: matk.id,
        nimetus: matk.nimetus,
        kirjeldus: matk.kirjeldus,
        osalejateArv: matk.osalejad.length
    })))
}

export function getHikeByIdCntrl(request, response) {
    const matkId = parseInt(request.params.id)
    if (!matkId) {
        return response.status(400).json({ error: 'Vigane matka ID' })
    }
    
    const matk = getHikeById(matkId)
    if (!matk) {
        return response.status(404).json({ error: 'Matka ei leitud' })
    }
    
    response.json({
        id: matk.id,
        nimetus: matk.nimetus,
        pildiUrl: matk.pildiUrl,
        kirjeldus: matk.kirjeldus,
        osalejad: matk.osalejad,
        osalejateArv: matk.osalejad.length
    })
}

export function getAllNewsCntrl(request, response) {
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
    ]
    response.json(uudised)
}

export function apiAddHikeCntrl(request, response) {
    console.log('Uus matk lisatud:', request.body)
}   
