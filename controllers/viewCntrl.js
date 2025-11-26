import { getAllHikes, getHikeById } from '../model/hikes.js'

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

