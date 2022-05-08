const express = require('express')
const router = express.Router()
const axios = require('axios')
const TMDB_API_KEY_1 = "1cf50e6248dc270629e802686245c2c8"

const MovieDB = require('node-themoviedb');
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

    (async () => {
        try {
          const movie = await mdb.movie.getPopular();
          const arrayOfPop = movie['data']['results']  
          const storeMovie = {}
          const arrayOfID = []
          const movieNames = []
          arrayOfPop.forEach(element => {
              storeMovie[element.id] = "https://image.tmdb.org/t/p/original" + element.poster_path
            arrayOfID.push(element.id)
            movieNames.push(element.original_title)
          });

          const authorName = []
          const args = {
            pathParameters: {
              movie_id: arrayOfID[0],
            },
          };
          
          const movieReviews = await mdb.movie.getReviews(args);
          const movRev1 = movieReviews['data']['results'][0];


          const args2 = {
            pathParameters: {
              movie_id: arrayOfID[1],
            },
          };

          const movieReviews2 = await mdb.movie.getReviews(args2);
          const movRev2 = movieReviews2['data']['results'][0];


          const args3 = {
            pathParameters: {
              movie_id: arrayOfID[2],
            },
          };

          const movieReviews3 = await mdb.movie.getReviews(args3);
          const movRev3 = movieReviews3['data']['results'][0];

      
        res.render('popFilm', {storeMovie : storeMovie, arrayOfID : arrayOfID, movRev1 : movRev1, movRev2 : movRev2 , movRev3 : movRev3 , movieNames : movieNames})
          // console.log(storeMovie)
        } catch (error) {
          console.error(error);
        }
    })();
        
})

module.exports = router 