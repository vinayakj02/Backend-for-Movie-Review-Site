const { request } = require('express')
var keyss = require('dotenv').config()
const express = require('express')
const axios = require('axios')
const app = express()

app.set('view engine', 'ejs')

app.get('/',(req, res) => {
    console.log('here')
    // res.render('index', {text: 'this is text'})
    res.send(keyss.config)
    console.log(keyss.config)
})

app.get('/try',(req,res) =>{
    res.send("")
})

const TMDB_API_KEY_1 = "1cf50e6248dc270629e802686245c2c8"
const fetchMovies = async (page) => {
    try {
      let result;
      await axios
        .get(
            `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=1cf50e6248dc270629e802686245c2c8`
        //   `https://api.themoviedb.org/3/movie/popular?api_key=1cf50e6248dc270629e802686245c2c8`
        )
        .then((response) => {
          result = response.data.results;
        })
        .catch((error) => {
          console.log(error);
        });
      return result;
    } catch (error) {
      console.error(error);
    }
  };

  app.get('/movies', async (req, res, next)=>{
    try {
        const {page} = req.query;
        const data = await fetchMovies(page);

        return res.status(200).json({
        //   status:200,
        //   message : 'success',
        //   message: `${data.length} movies found`, 
          data
        })
      } catch (err) {
        return next(err);
      }
})

const userRouter = require('./routes/users')

app.use('/users', userRouter)

app.listen(3000)