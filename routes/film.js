const express = require('express')
const router = express.Router()
const axios = require('axios')
const TMDB_API_KEY_1 = "1cf50e6248dc270629e802686245c2c8"




const MovieDB = require('node-themoviedb');
// ES6 Style
// import MovieDB from 'node-themoviedb';
const mdb = new MovieDB(TMDB_API_KEY_1);

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
      this.pop = MovieObj.popularity
      this.runtime = MovieObj.runtime
      this.tagline = MovieObj.tagline
  }
}


router.get('/', (req, res)=>{
    var curr_mov_id = req.query.id;
    (async () => {
        try {
          const args = {
            pathParameters: {
              movie_id: curr_mov_id,
            },
          };
          const movie = await mdb.movie.getDetails(args);
          const movieObj = new Movie(movie['data']);
          res.render('eachMovie', {title : movieObj.title, desc : movieObj.desc, date : movieObj.date, avgRating : movieObj.avgRating, voteCount : movieObj.voteCount, lang : movieObj.lang, genres : movieObj.genres, poster : movieObj.poster})
        } catch (error) {
          console.error(error);
        }
      })();

      
})

module.exports = router 