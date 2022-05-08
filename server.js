const { request } = require('express')
const express = require('express')
const axios = require('axios')
const app = express()
const TMDB_API_KEY_1 = "1cf50e6248dc270629e802686245c2c8"
const MovieDB = require('node-themoviedb');
const mdb = new MovieDB(TMDB_API_KEY_1);

console.log("server is up and runnninigggg")
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


app.get('/search', (req, resp)=>{
    var keyword = req.query.keyword;
    console.log(keyword)
    const https = require('https')
    const url = "https://api.themoviedb.org/3/search/movie?api_key=0b43b249ac283cc6cc7a6182942d3853&query=" + keyword;
    

    https.get(url, res => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        data = JSON.parse(data);
        console.log(data);

        const arrayOfPop = data['results']
        // resp.render("search", data['results'])
        // resp.send(data)
        const storeMovie = {}
        const arrayOfID = []
        arrayOfPop.forEach(element => {
            storeMovie[element.id] = "https://image.tmdb.org/t/p/original" + element.poster_path
            arrayOfID.push(element.id)
        });
        //   const reviews = await mdb.movie.getReviews(127585);
        resp.render('search', {storeMovie : storeMovie, arrayOfID : arrayOfID})
      })
    }).on('error', err => {
      console.log(err.message);
    }) 
})


app.get('/searchBrowse', (req, resp)=>{
  var year = req.query.year;
  var genre = req.query.genre;
  var voteCount = req.query.voteCount;

  const https = require('https')
  
  const url = "https://api.themoviedb.org/3/discover/movie?api_key=0b43b249ac283cc6cc7a6182942d3853&sort_by=vote_count.desc&include_adult=false&include_video=false&page=1&year=" + year  + "&with_genres=" + genre + "&with_watch_monetization_types=flatrate"
  https.get(url, res => {
    let data = '';
    res.on('data', chunk => {
      data += chunk;
    });
    res.on('end', () => {
      data = JSON.parse(data);
      console.log(data);

      const arrayOfPop = data['results']
      // resp.render("search", data['results'])
      // resp.send(data)
      const storeMovie = {}
      const arrayOfID = []
      arrayOfPop.forEach(element => {
          storeMovie[element.id] = "https://image.tmdb.org/t/p/original" + element.poster_path
          arrayOfID.push(element.id)
      });
      //   const reviews = await mdb.movie.getReviews(127585);
      resp.render('search', {storeMovie : storeMovie, arrayOfID : arrayOfID})
    })
  }).on('error', err => {
    console.log(err.message);
  }) 
})


const filmRoute = require('./routes/film')
const popFilmRoute = require('./routes/popFilm')

app.use('/film',filmRoute)
app.use('/popFilm',popFilmRoute)

app.listen(3000)