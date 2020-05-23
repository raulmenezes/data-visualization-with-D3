async function drawScatter() {
  const dataset = await d3.json('./../my_weather_data.json');
  console.log(dataset);

  const xAccessor = d => d.dewPoint;
  const yAccessor = d => d.humidity;

  const width = d3.min([window.innerWidth * 0.9, window.innerHeight * 0.9]);

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

  const wrapper = d3.select('#wrapper')
    .append('svg')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height)

  const bounds = wrapper
    .append('g')
    .style(
      'transform',
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    )

  const xScale = d3.scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice() // Round our scale’s domain, giving our x axis friendlier bounds.

  const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice();

  console.log(yScale.domain())

  // Not good if re-rendering the charts
  // Adds a level of nesting and drawing two sets of dots if run twice 
  // dataset.forEach(d => {
  //   bounds
  //     .append("circle")
  //     .attr("cx", xScale(xAccessor(d)))
  //     .attr("cy", yScale(yAccessor(d)))
  //     .attr("r", 5)
  // });

  function drawDots(dataset, color) {
    const dots = bounds.selectAll("circle").data(dataset)
      dots.join("circle") //  .join() is a shortcut for running .enter(), .append(), .merge()
        .attr("cx", d => xScale(xAccessor(d)))
        .attr("cy", d => yScale(yAccessor(d)))
        .attr("r", 5)
        .attr("fill", color)
  }

  const xAxisGenerator = d3.axisBottom().scale(xScale);

  const xAxis = bounds.append('g').call(xAxisGenerator)
    .style(
      'transform',
      `translateY(${dimensions.boundedHeight}px)`
    )

  const xAxisLabel = xAxis.append('text')
    .attr('x', dimensions.boundedWidth / 2)
    .attr('y', dimensions.margin.bottom - 10)
    .attr("fill", "black")
    .style("font-size", "1.4em")
    .html("Dew point (&deg;F)")

  const yAxisGenerator = d3.axisLeft().scale(yScale).ticks(4)

  const yAxis = bounds.append("g").call(yAxisGenerator)

  const yAxisLabel = yAxis.append('text')
    .attr('x', -dimensions.boundedHeight / 2)
    .attr('y', -dimensions.margin.left + 10)
    .attr("fill", "black")
    .style("font-size", "1.4em")
    .html("Humidity")
    .style("transform", "rotate(-90deg)")
    .style("text-anchor", "middle")

  const colorAccessor = d => d.cloudCover;

  const colorScale = d3.scaleLinear()
    .domain(d3.extent(dataset, colorAccessor))
    .range(["skyblue", "darkslategrey"])
  
  drawDots(dataset, d => colorScale(colorAccessor(d)));
}

drawScatter();
