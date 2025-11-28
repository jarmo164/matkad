const matk1 = {
    id: 1,
    nimetus: "Sügismatk Kõrvemaal",
    pildiUrl: "/assets/Hills.png",
    kirjeldus: "Lähme ja oleme kolm päeva looduses",
    osalejad: [
        {nimi: "mati", email: "mati@matkaja.ee"}, 
        {nimi: "kati", email: "kati@matkaja.ee"}
    ]
}

const matk2 = {
    id: 2,
    nimetus: "Süstamatk Hiiumaal",
    pildiUrl: "/assets/Butterfly.png",
    kirjeldus: "Lähme ja oleme kolm päeva vee peal",
    osalejad: [
        {nimi: "mati", email: "mati@matkaja.ee"}, 
        {nimi: "kati", email: "kati@matkaja.ee"}, 
        {nimi: "uudo", email: "uudo@ryhkija.ee"}]
}

const matkad = [
    matk1,
    matk2,
    {
        id: 3,
        nimetus: "Mägimatk Otepääl",
        pildiUrl: "/assets/Shadow.png",
        kirjeldus: "Lähme ja oleme kolm päeva mägedes",
        osalejad: [
            {nimi: "uudo", email: "uudo@ryhkija.ee"}
        ]
    }
]

export function getAllHikes() {
    return matkad
}

export function getHikeById(hikeId) {
    const matk = matkad.find(matk => {
        return matk.id === hikeId
    })
   
    return matk
}

export default matkad

export function addRegistration(matkId, nimi, email) {
    
    if (!nimi || !email) {
        return false
    }
    const matk = getHikeById(matkId)
    
    if (!matk) {
        return false
    }
    matk.osalejad.push({ nimi, email })
    return matk
}