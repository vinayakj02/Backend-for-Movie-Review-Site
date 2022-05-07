const { request } = require('express')
var keyss = require('dotenv').config()
const express = require('express')
const axios = require('axios')
const app = express()

app.set('view engine', 'ejs')

app.get('/',(req, res) => {
    console.log('here')
    // res.render('index', {text: 'this is text'})
    res.render('filmPage')
})

app.get('/try',(req,res) =>{
    res.send("")
})



class Movie {
    constructor(MovieObj) {
        this.title = MovieObj.original_title
        this.desc = MovieObj.overview
        this.date = MovieObj.release_date
        this.avgRating = MovieObj.vote_average
        this.voteCount = MovieObj.vote_count
        this.lang = MovieObj.original_language
        this.genres = MovieObj.genre_ids
        this.poster = "https://image.tmdb.org/t/p/original" + MovieObj.poster_path
    }
}


const TMDB_API_KEY_1 = "1cf50e6248dc270629e802686245c2c8"

// // const userRouter = require('./routes/users')
const filmRouter = require('./routes/film')

// app.use('/users', userRouter)
app.use('/film',filmRouter)










const apiKEY = "0b43b249ac283cc6cc7a6182942d3853"
const MovieDB = require('node-themoviedb');

const mdb = new MovieDB(apiKEY);



const fetchMovies = async (MovieId) => {
  console.log(MovieId)
  try {
    const args = {
      pathParameters: {
        movie_id: MovieId,
      },
    };
    const movie = await mdb.movie.getDetails(args);
    console.log(movie);
    /*
      {
        data: Object. Parsed json data of response
        headers: Object. Headers of response
      }
    */
  } catch (error) {
    console.error(error);
  }
};

const relData = fetchMovies(384018);
console.log(relData)

app.listen(3000)