const { request } = require('express')
const express = require('express')
const axios = require('axios')
const app = express()
const TMDB_API_KEY_1 = "1cf50e6248dc270629e802686245c2c8"

app.set('view engine', 'ejs')

app.get('/', (req, res)=>{
    res.send("hi")
})



const filmRoute = require('./routes/film')
const popFilmRoute = require('./routes/popFilm')

app.use('/film',filmRoute)
app.use('/popFilm',popFilmRoute)

app.listen(3000)
