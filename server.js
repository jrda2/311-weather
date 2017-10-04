
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
require('dotenv').config()
const app = express()

const apiKey = process.env.OPENWEATHER_APIKEY;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', {weather: null, error: null});
})

app.post('/', function (req, res) {
  let city = req.body.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

  request(url, function (err, response, body) {
    if(err){
      res.render('index', {weather: null, error: 'Error, please try again'});
    } else {
      let weather = JSON.parse(body)
      console.log(weather.main);
      if(weather.main == undefined){
        res.render('index', {weather: null, error: 'Error, please try again'});
      } else {
        let weatherText = `It's currently ${weather.weather[0].main} and ${weather.main.temp} degrees in ${weather.name}!`;
        let weatherInfo2 = `Today should include a high of ${weather.main.temp_max} with a low of ${weather.main.temp_min}`;
        let weather_ico = `http://openweathermap.org/img/w/`+ weather.weather[0].icon +`.png`;
        res.render('index', {weather: weatherText, weather_info2: weatherInfo2, weatherico: weather_ico, error: null});
      }
    }
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})