const matk1 = {
    id: 1,
    nimetus: "Sügismatk Kõrvemaal",
    pildiUrl: "/assets/Hills.png",
    kirjeldus: "Lähme ja oleme kolm päeva looduses",
    osalejad: ["mati@matkaja.ee", "kati@matkaja.ee"]
}

const matk2 = {
    id: 2,
    nimetus: "Süstamatk Hiiumaal",
    pildiUrl: "/assets/Butterfly.png",
    kirjeldus: "Lähme ja oleme kolm päeva vee peal",
    osalejad: ["mati@matkaja.ee", "kati@matkaja.ee", "uudo@ryhkija.ee"]
}

const matkad = [
    matk1,
    matk2,
    {
        id: 3,
        nimetus: "Mägimatk Otepääl",
        pildiUrl: "/assets/Shadow.png",
        kirjeldus: "Lähme ja oleme kolm päeva mägedes",
        osalejad: ["uudo@ryhkija.ee"]
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
 