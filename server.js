'use strict';
require('dotenv').config()
const PORT = process.env.PORT;
const express = require('express');
const cors = require('cors');

const superagent = require('superagent');
const app = express();
app.use(cors());
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
// =============================================================
app.get('/location', handleLocation);
app.get('/weather', handleWeather);
app.get('/parks', handlePark);
app.get('/movies', handlemovies);
app.get('/yelp', handleyelp);
//================================================================
app.use(errorHandler);

function errorHandler(err, request, response, next) {
  console.log('err', err);
  response.status(500).send('something is wrong in server');
}
//================================================================
function Location(name, location, latitude, longitude) {

  this.search_query = name,
    this.formatted_query = location,
    this.latitude = latitude,
    this.longitude = longitude
}
function handleLocation(request, response) {
  let key = process.env.GEOCODE_API_KEY;
  const city = request.query.city;
  let SQL =`SELECT * FROM locations WHERE lower(search_query)='${city.toLowerCase()}'`
  client.query(SQL).then(res=>{
    let fromdb=res.rows[0];
    if(fromdb){
      response.status(200).send(fromdb);
    }else{
      const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json&limit=1`;
      superagent.get(url).then(res => {
        const loc = res.body[0];
        const locData = new Location(city, loc.display_name, loc.lat, loc.lon);
        response.status(200).json(locData);
        let SQL =`INSERT INTO locations (search_query,formatted_query,latitude,longitude) VALUES($1,$2,$3,$4) RETURNING *`
        
        let values =Object.values(locData);
        client.query(SQL,values).then(res=>{
          console.log('saved to db',res);
        })
        
      }).catch(error => {
        console.log('error from location API', error);
      });
    }
  })

};


//=============================================================
function weather(description, valid_date) {
  this.forecast = description;
  this.time = valid_date;
}
function handleWeather(request, response) {
  const lat = request.query.latitude;
  const lon = request.query.longitude;
  let key = process.env.WEACODE_API_KEY;
  const locOBJ = request.query;
  console.log(request.query);
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${key}`;
  superagent.get(url).then(res => {
    const api = res.body.data[0];
    const locData = new weather(api.weather.description, api.datetime);
    let Arr = []
    Arr.push(locData)
    response.status(200).send(Arr);
  }).catch(error => {
    console.log('error from location API', error);
  })
};
//==================================================================
function Park(name, address, fee, description, url) {
  this.name = name,
    this.address = address,
    this.fee = fee,
    this.description = description,
    this.url = url
}
function handlePark(request, response) {
  let key = process.env.PARKS_API_KEY;
  const p = request.query;
  const url = `https://developer.nps.gov/api/v1/parks?${p.search_query}&api_key=${key}&limit=10`;
  superagent.get(url).then(res => {
    let apiparks = res.body.data.map(parkObj => {
      const parkData = new Park(parkObj.fullName, parkObj.addresses[0].line1, parkObj.entranceFees[0].cost, parkObj.description, parkObj.url);
      return parkData;
    });
    response.status(200).send(apiparks);
  })
}
//====================================================================================
function Movies(title, overview, average_votes, total_votes, image_url, popularity, released_on) {
  this.title = title;
  this.overview = overview;
  this.average_votes = average_votes;
  this.total_votes = total_votes;
  this.popularity = popularity;
  this.released_on = released_on;
  this.image_url = image_url;
}
function handlemovies(request, response) {
  let key = process.env.MOVIE_API_KEY;
  let url = `http://api.themoviedb.org/3/movie/top_rated?api_key=${key}&query=${request.query.city}&limit=30`
  superagent.get(url).then(res => {
    let apiparks = res.body.results.map(api => {
      const locData = new Movies(api.title, api.average_votes, api.total_votes, api.image_url, api.popularity, api.released_on);
      return locData;
    })
    response.status(200).send(apiparks);
  })
}
//=======================================================================================
function Yelp(name, image_url, price, rating, url) {
  this.name = name;
  this.image_url = image_url;
  this.price = price;
  this.rating = rating;
  this.url = url;
}
function handleyelp(request, response) {
  let key = process.env.YELP_API_KEY;
  let city = request.query.city;
  let url = `https://api.yelp.com/v3/businesses/search?location=${city}&limit=50`;


  let x = superagent.get(url).set('Authorization', `Bearer ${key}`).then(api => {
    const locData = new Yelp(api.name, api.image_url, api.rating, api.url);
    return locData;
  });
  response.status(200).send(x);
}
//==================================================================================



client.connect().then(() => {
  console.log("connected");

  app.listen(PORT, () => console.log(`App is running on Server on port: ${PORT}`));

});
