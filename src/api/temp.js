const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/temp", async (req, res) => {
  let getIP = "http://ip-api.com/json/";
  let openWeatherMap = "http://api.openweathermap.org/data/2.5/weather";

  axios
    .get(getIP)
    .then((response) => {
      let location = response.data;
      let params = {
        lat: location.lat,
        lon: location.lon,
        units: "metric",
        APPID: "e235cd05d6004c0780d19a279349857d",
      };

      axios
        .get(openWeatherMap, { params })
        .then((response) => {
          res.status(200).json({temp: response.data.main.temp});
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
/*
function getTemp() {
    return new Promise((resolve) => {
      var getIP = "http://ip-api.com/json/";
      var openWeatherMap = "http://api.openweathermap.org/data/2.5/weather";
      $.getJSON(getIP).done(function (location) {
        $.getJSON(openWeatherMap, {
          lat: location.lat,
          lon: location.lon,
          units: "metric",
          APPID: "e235cd05d6004c0780d19a279349857d",
        }).done(function (weather) {
          resolve(getImages(weather.main.temp));
        });
      });
    });
  }




*/
