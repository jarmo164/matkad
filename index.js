import express from 'express'
import { kontaktCntrl, indexCntrl, matkDetailCntrl, uudisedCntrl, registerHikeCntrl } from './controllers/viewCntrl.js'
import { apiHelloCntrl } from './controllers/apiCntrl.js'





const app = express()
app.use('/', express.static('public'))
app.set("views",  "./views");
app.set("view engine", "ejs");

app.get('/kontakt', kontaktCntrl)
app.get('/matk/:id', matkDetailCntrl)
app.get('/matk/:id/registreerumine', registerHikeCntrl)
app.get('/uudised', uudisedCntrl)

app.get('/', indexCntrl)
app.get('/api/hello', apiHelloCntrl)


const port = process.env.PORT || 8085
app.listen(port, () => console.log(`Server is running on port ${port}`))