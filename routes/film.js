const express = require('express')
const router = express.Router()
const axios = require('axios')
// router.get('/eachMoviePage' , (req, res) =>{
//     const data = fetchMovies(page);
//     var thisMovie = new Movie(data[0])
//     res.render('EachMovie', {title : thisMovie.title})

// })

// genres = {28 : "Action",
//           12 : "Adventure",
//           16 : "Animation",
//           35 : "Comedy",
//           80 : "Crime",
//           99 : "Documentary",
//           18 : "Drama",
//           10751 : "Family",
//           14 : "Fantasy",
//           36 : "History",
//           10402 : "Music",
//           9648 : "Mystery",
//           10749 : "Romance",
//           878 : "Science Fiction",
//           10770 : "TV Movie",
//           53 : "Thriller",
//           10752 : "War",
//           37 : "Western"}

// class Movie {
//     constructor(MovieObj) {

//         this.title = MovieObj.original_title
//         this.desc = MovieObj.overview
//         this.date = MovieObj.release_date
//         this.avgRating = MovieObj.vote_average
//         this.voteCount = MovieObj.vote_count
//         this.lang = MovieObj.original_language
//         this.genres = MovieObj.genre_ids
//         this.poster = "https://image.tmdb.org/t/p/original" + MovieObj.poster_path

        
//     }

// }

// // app.get('/eachMovie', (req, res) =>{
// //   const data =  fetchMovies(page);
// //   var thisMovie = new Movie(data[0])
// //   console.log(thisMovie)
// //   res.render('EachMovie', {title : thisMovie.title})
// // })

// const TMDB_API_KEY_1 = "1cf50e6248dc270629e802686245c2c8"
// const fetchMovies = async (MovieId) => {
//     const linkMovie = `https://api.themoviedb.org/3/movie/${MovieId}?api_key=0b43b249ac283cc6cc7a6182942d3853`
//     console.log('link : ' + linkMovie)
//     try {
//       let result;
//       await axios
//         .get(
//             // `https://api.themoviedb.org/3/movie/324857?api_key=0b43b249ac283cc6cc7a6182942d3853`
//             // `https://api.themoviedb.org/3/movie/${MovieId}?api_key=0b43b249ac283cc6cc7a6182942d3853`
//             linkMovie
//           // `https://api.themoviedb.org/3/movie/popular?api_key=1cf50e6248dc270629e802686245c2c8`
//         )
//         .then((response) => {
//           result = response.data.results;
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//         console.log("done")
//       return result;
//     } catch (error) {
//       console.error(error);
//     }
//   };

// router.get('/', async (req, res, next)=>{
//     try {
//         const movieid = req.query.id;
//         console.log(movieid)
//         const Moviedata = await fetchMovies(movieid).then(console.log("done "));
//         console.log("moviedata : " , Moviedata)
//         res.send(Moviedata)
//         // console.log(data)
//         // var firstMovie = new Movie(data)
//         // console.log("\n\n\n\n\n" + firstMovie.poster_path + "\n\n\n\nn\\n\n\n\n\n\n\n")
//         // res.send(data[0].poster_path)
//         // res.render('EachMovie', {poster : firstMovie.poster , title : firstMovie.title, desc : firstMovie.desc, date : firstMovie.date, avgRating : firstMovie.avgRating, voteCount : firstMovie.voteCount, lang : firstMovie.lang, genres : firstMovie.genres})
        
        
//       } catch (err) {
//         return next(err);
//       }
// })



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

// const relData = fetchMovies(384018);
// console.log(relData) 


router.get('/mov' , (req, res) => {
  const movID = req.query.id;
    // res.send('hello' + movID)
    const apiSingleMovieData = fetchMovies(movID);
    console.log("\n\n\n\n\n\n\n" + apiSingleMovieData['data'])
    

})

module.exports = router