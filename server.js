const { request } = require('express')
const express = require('express')
const axios = require('axios')
const app = express()
const TMDB_API_KEY_1 = "1cf50e6248dc270629e802686245c2c8"

const MovieDB = require('node-themoviedb');
const mdb = new MovieDB(TMDB_API_KEY_1);


app.set('view engine', 'ejs')

app.get('/', (req, res)=>{
    res.send("hi")
})


app.get('/homepage', (req, res)=>{

    (async () => {
        try {
          const movie = await mdb.movie.getPopular();
          
          const arrayOfPop = movie['data']['results']  
          const storeMovie = {}
          const arrayOfID = []
          arrayOfPop.forEach(element => {
              storeMovie[element.id] = "https://image.tmdb.org/t/p/original" + element.poster_path
            arrayOfID.push(element.id)
          });
        res.render('homepage', {storeMovie : storeMovie, arrayOfID : arrayOfID})
          console.log(storeMovie)
        } catch (error) {
          console.error(error);
        }
    })();

})



const filmRoute = require('./routes/film')
const popFilmRoute = require('./routes/popFilm')

app.use('/film',filmRoute)
app.use('/popFilm',popFilmRoute)

app.listen(3000)
