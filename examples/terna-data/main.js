const { select, scaleLinear, axisBottom, axisLeft, line } = d3;

fetch('./data.json')
  .then(response => response.json())
  .then(data => {
    const legendItems = select("#legend")
      .selectAll("li")
      .data(data);

    legendItems
      .enter()
      .append("li")
      .style("--gen-color", ({ color }) => color)
      .text(({ label }) => label);

    const svg = select("#chart");

    const margins = [20, 20, 50, 80];
    const { clientWidth, clientHeight } = svg.node();
    const innerWidth = clientWidth - margins[1] - margins[3];
    const innerHeight = clientHeight - margins[0] - margins[2];

    const maxValues = data.map(({ values }) => Math.max(...values));

    const scaleX = scaleLinear()
      .domain([1963, 2015])
      .nice()
      .range([0, innerWidth]);
    const scaleY = scaleLinear()
      .domain([0, Math.max(...maxValues)])
      .nice()
      .range([innerHeight, 0]);

    const xAxisWrapper = svg
      .append("g")
      .attr("transform", `translate(${margins[3]}, ${margins[0] + innerHeight})`);
    const yAxisWrapper = svg
      .append("g")
      .attr("transform", `translate(${margins[3]}, ${margins[0]})`);

    const xAxis = axisBottom(scaleX).tickFormat(year => `${year}`);
    const yAxis = axisLeft(scaleY).tickFormat(
      value => `${Math.round(value / 1000)} TWh`
    );

    xAxisWrapper.call(xAxis);
    yAxisWrapper.call(yAxis);

    const chartLine = line()
      .x((_, i) => scaleX(1963 + i))
      .y(value => scaleY(value));

    const chartRoot = svg
      .append("g")
      .attr("class", "chart")
      .attr("transform", `translate(${margins[3]}, ${margins[0]})`);

    const lines = chartRoot.selectAll("path").data(data);

    lines
      .enter()
      .append("path")
      .attr("stroke", ({ color }) => color)
      .attr("d", ({ values }) => chartLine(values));
  });
