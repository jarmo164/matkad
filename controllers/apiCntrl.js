import { getAllHikes, getHikeById, patchHikeById, addHike, addRegistration } from '../model/hikesdb.js'

export async function returnAllHikesCntrl(request, response) {
    const matkad = await getAllHikes()
    response.json(matkad.map(matk => ({
        id: matk.id,
        nimetus: matk.nimetus,
        kirjeldus: matk.kirjeldus,
        osalejateArv: matk.osalejad.length
    })))
}

export async function getHikeByIdCntrl(request, response) {
    const matkId = parseInt(request.params.id)
    if (!matkId) {
        return response.status(400).json({ error: 'Vigane matka ID' })
    }
    
    const matk = await getHikeById(matkId)
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

export async function apiAddHikeCntrl(request, response) {
    console.log('Uus matk lisatud:', request.body)
    const { nimetus, kirjeldus, pildiUrl } = request.body
    
    if (!nimetus) {
        return response.status(400).json({ error: 'Nimetus on kohustuslik väli' })
    }
    
    try {
        const newHikeId = await addHike({ nimetus, kirjeldus, pildiUrl })
        const newHike = await getHikeById(newHikeId)
        response.status(201).json(newHike)
    } catch (error) {
        return response.status(500).json({ error: error.message })
    }
}
export function apideleteHikeByIdCntrl(request, response) {
    console.log('Matk kustutatud:', request.params.id)
}
export async function apipatchHikeByIdCntrl(request, response) {
    const matkId = parseInt(request.params.id)
    
    if (!matkId) {
        return response.status(400).json({ error: 'Vigane matka ID' })
    }
    
    const patch = {
        nimetus: request.body.nimetus,
        kirjeldus: request.body.kirjeldus,
        osalejad: request.body.osalejad
    }
    
    try {
        const matk = await patchHikeById(matkId, patch)
        response.status(200).json(matk)
    } catch (error) {
        return response.status(404).json({ error: error.message })
    }
}

export async function apiAddOsalejadCntrl(request, response) {
    console.log('Osaleja lisatud:', request.body)
    const matkId = parseInt(request.params.id)
    
    if (!matkId) {
        return response.status(400).json({ error: 'Vigane matka ID' })
    }
    
    if (!request.body.nimi || !request.body.email) {
        return response.status(400).json({ error: 'Nimi ja email on kohustuslikud väljad' })
    }
    
    const result = await addRegistration(matkId, request.body.nimi, request.body.email)
    
    if (!result) {
        return response.status(404).json({ error: 'Matka ei leitud või osaleja lisamine ebaõnnestus' })
    }
    
    response.status(201).json(result)
}