'use strict';

require('dotenv').config()
const PORT =process.env.PORT ; 
const express = require('express'); 
const cors = require('cors');
const superagent = require('superagent');

const app = express(); 
app.use(cors());
app.get('/location', handleLocation);
app.get('/weather', handleWeather);
// app.get('/Park', handlePark);


let key=process.env.GEOCODE_API_KEY
let wekey= process.env.WEACODE_API_KEY
// let PARKSkey= process.env.WEACODE_API_KEY

function Location(name, location, latitude, longitude) {
        this.search_query = name,
        this.formatted_query = location,
        this.latitude = latitude,
        this.longitude = longitude
}
function Weather(description, valid_date) {
    this.forecast = description,
     this.time = valid_date;

}

// function Park(data){
//     this.name=data.fullName;
//     this.address=Object.values(data.addresses[0]).join(',');
//     this.fee =data.entranceFees[0].cost;
//     this.description=data.description;
//     this.url=data.url;
//   }


//   function handlePark(request,response){
//     const p = request.query; 
//     const url = `https://developer.nps.gov/api/v1/parks?parkCode=${qu}&api_key=${key}`;
//     superagent.get(url).then(data=> {
//       let currentParks=[];
//       let parks=data.body.data.slice(0,11);
//       console.log(parks);
//       currentParks= parks.map(element=> new Parks(element));
//       console.log(currentParks);
//       response.send(currentParks);
//     }).catch((err)=> {
//       console.log('ERROR IN LOCATION API');
//       console.log(err);
//     });
  
//   }
function handleLocation(request, response) {

    const city = request.query.city; 
    const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json&limit=1`;
    superagent.get(url).then(res=> {
        const loc = res.body[0];
        const locData = new Location(request.query.city, loc.display_name, loc.lat, loc.lon);
        response.status(200).json(locData);
    })
    };

    function handleWeather (request,response){
        const city = request.query; 
        console.log(request.query);
        const url = `https://api.weatherbit.io/v2.0/current?lat=${city.latitude}&lon=${city.longitude}&key=${wekey}&include=minutely`
        superagent.get(url).then(res=> {
            const api = res.body.data;

            const locData = new Weather(api[0].weather.description,api[0].datetime);
            let Arr=[]
            Arr.push(locData)
            console.log(Arr);
            response.send(Arr);
        })
    }



app.listen(PORT, ()=> console.log(`App is running on Server on port: ${PORT}`));