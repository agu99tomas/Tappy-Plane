function getImages(temp) {
  if (temp <= 10) {
    return {
      rockDown: "rockIceDown.png",
      rock: "rockIce.png",
      ground: "groundIce.png",
    };
  }

  if (temp <= 18) {
    return {
      rockDown: "rockSnowDown.png",
      rock: "rockSnow.png",
      ground: "groundSnow.png",
    };
  }

  return {
    rockDown: "rockGrassDown.png",
    rock: "rockGrass.png",
    ground: "groundGrass.png",
  };
}

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

async function asyncImagesBasedOnTemp(callable) {
  const imagesBasedOnTemp = await getTemp();
  callable(imagesBasedOnTemp);
}



