async function drawLineChart() {
  const dataset = await d3.json("../my_weather_data.json");
  console.table(dataset[0])
}

drawLineChart();
