'use strict';
const PORT = 3000;
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.get('/location', handleLocation);
app.get('/weather', handleWeather);

function Location(city, data) {
    this.search_query = city;
    this.formatted_query = data[0].display_name;
    this.latitude = data[0].lat;
    this.longitude = data[0].lon;
}

function handleLocation(request, response) {
    const getLocation = require('./data/location.json');
    console.log(request.query);
    const city = request.query.city;
    console.log("city---->", city);

    let location = new Location(city, getLocation)
    response.send(location)
}

function weather(weather) {
    this.forecast = weather.weather.description;

    this.datetime = weather.datetime;
}




function handleWeather(request, response) {
    const data = require('./data/weather.json');
    const restaurants = data.nearby_restaurants;
    const restaurantResponse = [];
    data.forEach(element => {
        restaurantResponse.push(new weather(element))

    });
    response.send(restaurantResponse);
}

app.listen(PORT, () => console.log(`App is running on Server on port: ${PORT}`))