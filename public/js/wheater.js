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
    let lat = -73.726593; 
    let lon = -67.479119;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        var getTemp = window.location.href + `api/temp?lat=${lat}&lon=${lon}`;

        $.getJSON(getTemp).done(function (data) {
          resolve(getImages(data.temp));
        });
      },
      () => {
        var getTemp = window.location.href + `api/temp?lat=${lat}&lon=${lon}`;

        $.getJSON(getTemp).done(function (data) {
          resolve(getImages(data.temp));
        });
      }
    );

  });
}

async function asyncImagesBasedOnTemp(callable) {
  const imagesBasedOnTemp = await getTemp();
  callable(imagesBasedOnTemp);
}
