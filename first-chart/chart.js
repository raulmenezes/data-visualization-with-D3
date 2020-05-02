async function drawLineChart() {
  const dataset = await d3.json("../my_weather_data.json");

  const yAccessor = d => d.temperatureMax;

  const dateParser = d3.timeParse("%Y-%m-%d");
  const xAccessor = d => dateParser(d.date);

  console.log(dataset[0]);
  console.log(yAccessor(dataset[0]));
  console.log(xAccessor(dataset[0]));

  let dimensions = calculateChartDimensions();
  console.log(dimensions);
}

function calculateChartDimensions() {
  const dimensions = {
    width: window.innerWidth * 0.9,
    height: 400,
    margin: {
          top: 15,
          right: 15,
          bottom: 40,
          left: 60,
      },
    }
  
    dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom
    return dimensions; 
}

drawLineChart();
