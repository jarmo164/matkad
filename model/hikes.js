import {join} from "path"
import {writeFileSync, readFileSync, existsSync} from "fs"
const hikesFilePath = join(process.cwd(), process.env.DATA_FILE_HIKES)


let matkad = []

// Kontrolli, kas hikes.json fail eksisteerib, kui mitte, loo see algandmetega
if (!existsSync(hikesFilePath)) {
    writeFileSync(hikesFilePath, JSON.stringify(matkad, null, 2), "utf-8")
} else {
    // Kui fail eksisteerib, loe andmed sealt
    const hikes = JSON.parse(readFileSync(hikesFilePath, "utf-8"))
    matkad = hikes
}
function storeAllHikes() {
    writeFileSync(hikesFilePath, JSON.stringify(matkad))
}

function loadAllHikes() {
    const hikesString = readFileSync(hikesFilePath, "utf-8")
    matkad = JSON.parse(hikesString)
}

export function initModel() {
    loadAllHikes()  
}

export function getAllHikes() {
    loadAllHikes()
    return matkad
}

export function getHikeById(hikeId) {
    loadAllHikes()
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

export function addHike({nimetus, kirjeldus, pildiUrl}) {
    const newHike = {
        id: matkad.length + 1,
        nimetus,
        kirjeldus,
        pildiUrl:pildiUrl||"/assets/Hills.png",
        osalejad: []
    }   
    matkad.push(newHike)
    storeAllHikes()
    return newHike.id  
}

export function deleteHikeById(hikeId) {
    const matk = getHikeById(hikeId)
    
    if (!matk) {
        throw new Error('Matka ei leitud')
    }
    matkad = matkad.filter((element) => {
        return element.id !== hikeId
    })
    storeAllHikes()
}

export function patchHikeById(hikeId, {nimetus, kirjeldus, osalejad}) {
    const matk = getHikeById(hikeId)
    if (!matk) {
        throw new Error('Matka ei leitud')
    }
    if (nimetus !== undefined) {
        matk.nimetus = nimetus
    }
    if (kirjeldus !== undefined) {
        matk.kirjeldus = kirjeldus
    }
    if (osalejad !== undefined) {
        matk.osalejad = osalejad
    }
    storeAllHikes()
    return matk
}