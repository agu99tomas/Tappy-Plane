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
    var getTemp = window.location.href + "api/temp";
    $.getJSON(getTemp).done(function (temp) {
      resolve(getImages(temp.temp));
    });
  });
}

async function asyncImagesBasedOnTemp(callable) {
  const imagesBasedOnTemp = await getTemp();
  callable(imagesBasedOnTemp);
}



