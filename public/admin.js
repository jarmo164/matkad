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

function getrightpaneHTML({id, nimetus, kirjeldus, osalejad}) {
    let osalejadHTML = ``
    osalejad.forEach(osaleja => {
        osalejadHTML += `
        <div class="row">
            <div class="col-4">${osaleja.nimi}</div>
            <div class="col-4">${osaleja.email}</div>
        </div>
        `
    })
    return `
    <h3>${nimetus}</h3>
    <p>${kirjeldus}</p>
    <div class="osalejad">
        <h3>Osalejad</h4>
        <div class="row">
            <div class="col-4">nimi</div>
            <div class="col-4">email</div>
        </div>
        ${osalejadHTML}
        <div class="row">
            <div class="col-4">
                <input type="text" id="nimi" name="nimi" placeholder="nimi">
            </div>
            <div class="col-4">
                <input type="text" id="email" name="email" placeholder="email">
            </div>
        </div>
        <div class="col-4">
            <button class="btn btn-link" onclick="addOsalejad(${id})">Lisa</button>
        </div>
    </div>

    `
}
async function addOsalejad(id) {
    console.log('Lisa osalejad', id)
    
    // Otsime elemendid right-pane seest, et vältida võimalikke konflikte
    const rightPane = document.getElementById('right-pane')
    if (!rightPane) {
        showError('Parem pane puudub')
        return
    }
    
    const nimiElement = rightPane.querySelector('#nimi')
    const emailElement = rightPane.querySelector('#email')
    
    if (!nimiElement || !emailElement) {
        showError('Nimi ja email väljad puuduvad')
        console.error('nimiElement:', nimiElement, 'emailElement:', emailElement)
        return
    }
    
    const nimi = nimiElement.value.trim()
    const email = emailElement.value.trim()
    
    if (!nimi || !email) {
        showError('nimi ja email on kohustuslikud')
        return
    }
    await postOsalejad({
        id:id, 
        nimi:nimi, 
        email:email})
    clickOnLeftPaneRow(id)


}
function renderRightPane({id, nimetus, kirjeldus, osalejad}) {
    const rightpaneElement = document.getElementById('right-pane')
    const rightpaneHTML = getrightpaneHTML({id, nimetus, kirjeldus, osalejad})
    rightpaneElement.innerHTML = rightpaneHTML
}




function renderPage(hikes) {
    const adminElement = document.getElementById('admin-container')
    
    const pageHTML = `
        <div class="row">
            <div class="col-4">
                ${getleftpaneHTML(hikes)}
            </div>
            <div class=col-8 id="right-pane">
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

async function postOsalejad({id, nimi, email}) { 
    const osalejad = {
        nimi: nimi,
        email: email
    }  
    const response = await fetch(`${allHikesUrl}/${id}/osalejad`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        
        body: JSON.stringify(osalejad)
    })
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Tundmatu viga' }))
        showError(`Osaleja lisamine ebaõnnestus: ${errorData.error || 'Tundmatu viga'}`)
        return null
    }
    return true
}

function showError(message) {
 console.log(message)
}

async function lisamaatk() {
    // Näita matka lisamise vormi
    const rightPane = document.getElementById('right-pane')
    rightPane.innerHTML = getAddHikeFormHTML()
    
    // Lisa event listener vormile
    const form = document.getElementById('add-hike-form')
    if (form) {
        form.addEventListener('submit', submitAddHike)
    }
}

function getAddHikeFormHTML() {
    return `
        <h3>Lisa uus matk</h3>
        <form id="add-hike-form">
            <div class="mb-3">
                <label for="nimetus" class="form-label">Nimetus *</label>
                <input type="text" class="form-control" id="nimetus" name="nimetus" required placeholder="Matka nimetus">
            </div>
            <div class="mb-3">
                <label for="kirjeldus" class="form-label">Kirjeldus</label>
                <textarea class="form-control" id="kirjeldus" name="kirjeldus" rows="4" placeholder="Matka kirjeldus"></textarea>
            </div>
            <div class="mb-3">
                <label for="pildiUrl" class="form-label">Pildi URL</label>
                <input type="text" class="form-control" id="pildiUrl" name="pildiUrl" placeholder="/assets/Hills.png">
                <small class="form-text text-muted">Jäta tühjaks, et kasutada vaikimisi pilti</small>
            </div>
            <div class="mb-3">
                <button type="submit" class="btn btn-primary">Lisa matk</button>
                <button type="button" class="btn btn-secondary" onclick="cancelAddHike()">Tühista</button>
            </div>
        </form>
    `
}

function cancelAddHike() {
    const rightPane = document.getElementById('right-pane')
    rightPane.innerHTML = `
        <h3>Parem pane</h3>
        <p>Vali vasakult matk või lisa uus matk</p>
    `
}

async function submitAddHike(event) {
    event.preventDefault()
    
    const form = event.target
    const formData = new FormData(form)
    
    const nimetus = formData.get('nimetus').trim()
    const kirjeldus = formData.get('kirjeldus').trim()
    const pildiUrl = formData.get('pildiUrl').trim()
    
    if (!nimetus) {
        showError('Nimetus on kohustuslik väli')
        return
    }
    
    const hikeData = {
        nimetus: nimetus,
        kirjeldus: kirjeldus || undefined,
        pildiUrl: pildiUrl || undefined
    }
    
    try {
        const response = await fetch('/api/matk', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(hikeData)
        })
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Tundmatu viga' }))
            showError(`Matka lisamine ebaõnnestus: ${errorData.error || 'Tundmatu viga'}`)
            return
        }
        
        const newHike = await response.json()
        
        // Värskenda lehte
        const hikes = await fetchAllHikes()
        renderPage(hikes)
        
        // Näita uut matka
        await clickOnLeftPaneRow(newHike.id)
        
        showError('') // Tühista viga, kui oli
    } catch (error) {
        showError(`Viga: ${error.message}`)
    }
}

async function initialRender() {
    const hikes = await fetchAllHikes()
    renderPage(hikes)
}
initialRender()