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
    let lat = 31.88232;
    let lon = -170.03175;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        var getTemp = window.location.href + `api/temp?lat=${lat}&lon=${lon}`;

        $.getJSON(getTemp).done(function (data) {
          resolve(getImages(data.temp));
        });
      });

    } else {

      var getTemp = window.location.href + `api/temp?lat=${lat}&lon=${lon}`;

      $.getJSON(getTemp).done(function (data) {
        resolve(getImages(data.temp));
      });
    }
  });

}

async function asyncImagesBasedOnTemp(callable) {
  const imagesBasedOnTemp = await getTemp();
  callable(imagesBasedOnTemp);
}
