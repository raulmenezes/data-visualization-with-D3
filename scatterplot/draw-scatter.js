async function drawScatter() {
  const dataset = await d3.json('./../my_weather_data.json');
  console.log(dataset);

  const xAccessor = d => d.dewPoint;
  const yAccessor = d => d.humidity;
  
  const width = d3.min([ window.innerWidth * 0.9, window.innerHeight * 0.9]);

  let dimensions = {
    width: width,
    height: width,
    margin: {
      top: 10,
      right: 10,
      bottom: 50,
      left: 50,
    },
  }

  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  console.log(dimensions);

  const wrapper = d3.select('#wrapper')
    .append('svg')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height)

  const bound = wrapper
    .append('g')
    .style('transform', `translate(${ dimensions.margin.left }px, ${ dimensions.margin.top }px)`)

  const xScale = d3.scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range(0 , dimensions.boundedWidth)
    .nice()
    
  const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range(0 , dimensions.boundedHeight)
    .nice();
  
}

drawScatter();
