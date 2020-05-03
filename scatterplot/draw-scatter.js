async function drawScatter() {
  const dateset = await d3.json('./../my_weather_data.json');
  console.log(dateset);

  const xAccessor = d => d.dewPoint;
  const yAccessor = d => d.humidity;
}

drawScatter();
