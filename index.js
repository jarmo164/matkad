import express from 'express'
import { kontaktCntrl, indexCntrl, matkDetailCntrl, uudisedCntrl, registerHikeCntrl } from './controllers/viewCntrl.js'
import { returnAllHikesCntrl, 
    apiAddHikeCntrl, 
    getHikeByIdCntrl, 
    getAllNewsCntrl, 
    apideleteHikeByIdCntrl, 
    apipatchHikeByIdCntrl, 
    apiAddOsalejadCntrl,
    } from './controllers/apiCntrl.js'
import { adminCntrl } from './controllers/adminview.js'
import { initModel } from './model/hikes.js'




const app = express()
app.use('/', express.static('public'))
app.use(express.json())
app.set("views",  "./views");
app.set("view engine", "ejs");

app.get('/kontakt', kontaktCntrl)
app.get('/matk/:id', matkDetailCntrl)
app.get('/matk/:id/registreerumine', registerHikeCntrl)
app.get('/uudised', uudisedCntrl)
app.get('/admin', adminCntrl)
app.get('/', indexCntrl)


app.get('/api/matk', returnAllHikesCntrl)
app.get('/api/matk/:id', getHikeByIdCntrl)
app.delete('/api/matk/:id', apideleteHikeByIdCntrl)
app.patch('/api/matk/:id', apipatchHikeByIdCntrl)
app.post('/api/matk', apiAddHikeCntrl)
app.get('/api/uudised', getAllNewsCntrl)
app.post('/api/matk/:id/osalejad', apiAddOsalejadCntrl)



const port = process.env.PORT || 8085
app.listen(port, async () => {
    console.log(`Server is running on port ${port}`)
    await initModel()
})