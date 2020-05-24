async function drawBarChart() {
	const dataset = await d3.json('../my_weather_data.json')
	console.log(dataset);

	// Only one metric for the whole chart.
	// The y axis is plotting the frequency
	const metricAccessor = d => d.humidity;
	const yAccessor = d => d.length

	const width = 600;
	let dimensions = {
		width: width,
		height: width,
		margin: {
			top: 30,
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
			'translate',
			`translate(
        ${dimensions.margin.left}px, 
        ${dimensions.margin.top}px
      )`
		);

	const xScale = d3.scaleLinear()
		.domain(d3.extent(dataset, metricAccessor))
		.range([0, dimensions.boundedWidth])
		.nice();

	const binGenerator = d3.histogram()
		.domain(xScale.domain())
		.value(metricAccessor)
		.thresholds(12);
		// .thresholds([0, 0.2, 0.4, 0.6, 0.8, 1]);

	const bins = binGenerator(dataset);

	console.log(bins)
	const yScale = d3.scaleLinear()
		.domain([0, d3.max(bins, yAccessor)])
		.range([dimensions.boundedHeight, 0])
		.nice();

	const binsGroup = bounds.append('g');

	// Create one new <g> element for each bin.
	// We’re going to place our bars within this group.
	const binGroups = binsGroup.selectAll('g')
		.data(bins)
		.enter().append("g")

	const barPadding = 1

	const binRects = binGroups.append('rect')
		.attr('x', d => xScale(d.x0) + barPadding / 2)
		.attr('y', d => yScale(yAccessor(d)))
		.attr('width', d => d3.max([
			0,
			xScale(d.x1) - xScale(d.x0) - barPadding
		]))
		.attr('height', d => dimensions.boundedHeight - yScale(yAccessor(d)))
		.attr("fill", "cornflowerblue")
	
	const binText = binGroups.filter(yAccessor)
		.append('text')
		.attr("x", d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
		.attr("y", d => yScale(yAccessor(d)) - 5)
		.text(yAccessor)
		.style("text-anchor", "middle")
		.attr("fill", "darkgrey")
		.style("font-size", "12px")
		.style("font-family", "sans-serif")

	const mean = d3.mean(dataset, metricAccessor)

	const meanLine = bounds.append('line')
		.attr("x1", xScale(mean))
		.attr("x2", xScale(mean))
		.attr("y1", 12)
		.attr("y2", dimensions.boundedHeight)
		.attr("stroke", "maroon")
		.attr("stroke-dasharray", "2px 4px")

	const meanText = bounds.append('text')
		.text('mean')
		.attr("x", xScale(mean))
		.attr("y", 10)
		.attr("fill", "maroon")
		.style("text-anchor", "middle")
}

drawBarChart();
