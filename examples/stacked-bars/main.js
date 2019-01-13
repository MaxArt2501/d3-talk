const { select, scaleBand, scaleLinear, axisBottom, axisLeft, stack, sum, transpose } = d3;

const months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');

fetch('./data.json')
  .then(response => response.json())
  .then(data => {
    const legendItems = select('#legend')
      .selectAll('li')
      .data(data);

    legendItems
      .enter()
      .append('li')
      .style('--gen-color', ({ color }) => color)
      .text(({ label }) => label);

    const svg = select('#chart');

    const margins = [20, 20, 50, 80];
    const { clientWidth, clientHeight } = svg.node();
    const innerWidth = clientWidth - margins[1] - margins[3];
    const innerHeight = clientHeight - margins[0] - margins[2];

    const sums = months.map((_, i) => sum(data.map(({ values }) => values[i])));

    const scaleX = scaleBand()
      .padding(0.1)
      .domain(months)
      .range([0, innerWidth]);
    const scaleY = scaleLinear()
      .domain([0, Math.max(...sums)])
      .nice()
      .range([innerHeight, 0]);

    const xAxisWrapper = svg
      .append('g')
      .attr('transform', `translate(${margins[3]}, ${margins[0] + innerHeight})`);
    const yAxisWrapper = svg
      .append('g')
      .attr('transform', `translate(${margins[3]}, ${margins[0]})`);

    const xAxis = axisBottom(scaleX)
      .tickPadding(8)
      .tickSize(0);
    const yAxis = axisLeft(scaleY).tickFormat(
      value => `${Math.round(value / 1000)} TWh`
    );

    xAxisWrapper.call(xAxis);
    yAxisWrapper.call(yAxis);

    const dataMatrix = transpose(data.map(type => type.values));
    const stackData = stack().keys(Object.keys(data))(dataMatrix);

    const chartRoot = svg
      .append('g')
      .attr('class', 'chart')
      .attr('transform', `translate(${margins[3]}, ${margins[0]})`);

    const stacks = chartRoot.selectAll('.stack').data(stackData);

    const layer = stacks
      .enter()
      .append('g')
      .attr('class', 'stack')
      .attr('fill', (_, i) => data[i].color);

    const bandWidth = scaleX.bandwidth();
    layer
      .selectAll('rect')
      .data(d => d)
      .enter()
      .append('rect')
      .attr('x', (_, i) => scaleX(months[i]))
      .attr('width', bandWidth)
      .attr('y', ([, end]) => scaleY(end))
      .attr('height', ([start, end]) => scaleY(start) - scaleY(end));
  });
