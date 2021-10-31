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
    navigator.geolocation.getCurrentPosition(position =>{
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;
      console.log(lat, lon);
      var getTemp = window.location.href + `api/temp?lat=${lat}&lon=${lon}`;

      $.getJSON(getTemp).done(function (data) {
        console.log(data)
        resolve(getImages(data.main.temp));
      });

    });

  });
}

async function asyncImagesBasedOnTemp(callable) {
  const imagesBasedOnTemp = await getTemp();
  callable(imagesBasedOnTemp);
}



