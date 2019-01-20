const { select, scaleBand, scaleLinear, axisBottom, axisLeft, line } = d3;

const months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');

fetch('./data.json')
  .then(response => response.json())
  .then(data => {
    data.sort(
      (type1, type2) => Math.max(...type1.values) - Math.max(...type2.values)
    );

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

    const minValues = data.map(({ values }) => Math.min(...values));

    const scaleX = scaleBand()
      .paddingInner(1)
      .paddingOuter(0.25)
      .domain(months)
      .range([0, innerWidth]);
    const scaleY = scaleLinear()
      .domain([0, Math.min(...minValues)])
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
    const yAxis = axisLeft(scaleY)
      .tickSize(-innerWidth)
      .tickFormat(value => (value % 2000 ? '' : `${Math.round(value / 1000)} TWh`));

    xAxisWrapper.call(xAxis);
    yAxisWrapper.call(yAxis);

    const chartLine = line()
      .x((_, i) => scaleX(months[i]))
      .y(value => scaleY(value));

    const chartRoot = svg
      .append('g')
      .attr('class', 'chart')
      .attr('transform', `translate(${margins[3]}, ${margins[0]})`);

    function drawChart(index) {
      const reducedData = data.slice(0, index + 1);

      const emptyData = reducedData.map(genType => ({
        ...genType,
        values: [...genType.values].fill(0)
      }));

      chartRoot
        .selectAll('path')
        .data(emptyData)
        .enter()
        .append('path')
        .attr('stroke', ({ color }) => color)
        .attr('d', ({ values }) => chartLine(values));

      const maxValues = reducedData.map(({ values }) => Math.max(...values));
      scaleY.domain([0, Math.max(...maxValues)]).nice();

      yAxisWrapper.transition().call(yAxis);

      chartRoot
        .selectAll('path')
        .data(reducedData)
        .transition()
        .duration(1000)
        .attr('d', ({ values }) => chartLine(values))
        .on('start', (_, i) => {
          if (i === index) {
            select(`#legend li:nth-child(${i + 1})`).classed('done', true);
          }
        });
    }

    data.forEach((genType, index) => {
      setTimeout(() => drawChart(index), (index + 1) * 2000);
    });
  });
