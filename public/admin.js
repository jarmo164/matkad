const allHikesUrl = '/api/matk'

async function clickOnLeftPaneRow(id) {
    console.log('klickiti real', id)
    const hikeDetails = await fetchHikeById(id)
    console.log(hikeDetails)
    renderRightPane(hikeDetails)
}
async function fetchHikeById(id) {
    const response = await fetch(`${allHikesUrl}/${id}`)
    if (!response.ok) {
        showError('Failed to fetch hike')
        return null
    }
    const hike = await response.json()
    return hike

}
function getleftpaneHTML(hikes) {
    if (!hikes || hikes.length === 0) {
        return '<p>Matkasid pole</p>'
    }
    
    let leftpaneHTML = ``
    hikes.forEach(hike => {
        leftpaneHTML += `
        <div class="row leftpane-row " onclick="clickOnLeftPaneRow(${hike.id})">
           <h5>${hike.nimetus}</h5>
        </div>
        `
    })
    
    leftpaneHTML += `
        <div class="btn btn-primary" onclick="lisamaatk()">
            Lisa uus matk
        </div>
    `
    
    return leftpaneHTML
}

function getrightpaneHTML({nimetus, kirjeldus, osalejad}) {
    let osalejadHTML = ``
    osalejad.forEach(osaleja => {
        osalejadHTML += `
        <div class="row">
            <div class="col-6">${osaleja.nimi}</div>
            <div class="col-6">${osaleja.email}</div>
        </div>
        `
    })
    return `
    <h3>${nimetus}</h3>
    <p>${kirjeldus}</p>
    <div class="osalejad">
        <h3>Osalejad</h4>
        <div class="row">
            <div class="col-6">nimi</div>
            <div class="col-6">email</div>
        </div>
        ${osalejadHTML}
    </div>

    `
}
function renderRightPane(nimetus, kirjeldus, osalejad) {
    const rightpaneElement = document.getElementById('right-pane')
    const rightpaneHTML = getrightpaneHTML(nimetus, kirjeldus, osalejad)
    rightpaneElement.innerHTML = rightpaneHTML
}




function renderPage(hikes) {
    const adminElement = document.getElementById('admin-container')
    
    const pageHTML = `
        <div class="row">
            <div class="col-4">
                ${getleftpaneHTML(hikes)}
            </div>
            <div id="right-pane">
                <h3>Parem pane</h3>
                loading...
            </div>
        </div>
    `   
    adminElement.innerHTML = pageHTML
}
async function fetchAllHikes() {
    const response = await fetch('/api/matk')
    const data = await response.json()
    return data
}
function showError(message) {
 console.log(message)
}
async function initialRender() {
    const hikes = await fetchAllHikes()
    renderPage(hikes)
}
initialRender()