const CHART_RATIO = 16 / 10;
const MARGINS = [ 20, 20, 50, 50 ];
const API_ROOT = 'https://rickandmortyapi.com/api/episode';

const {
  axisBottom,
  axisLeft,
  scaleBand,
  scaleLinear,
  select
} = d3;

const seasonData = {};

const seasonSelect = select('#seasonSelect')
  .on('input', drawChart);

const scaleX = scaleBand().padding(.5);
const scaleY = scaleLinear();

const axisX = axisBottom(scaleX);
const axisY = axisLeft(scaleY);

const svgRoot = select('svg');
const svgEl = svgRoot.node();

const xAxisWrapper = svgRoot.append('g');
const yAxisWrapper = svgRoot.append('g');
const chartRoot = svgRoot.append('g');

yAxisWrapper.attr('transform', `translate(${MARGINS[3]}, ${MARGINS[0]})`);
chartRoot.attr('transform', `translate(${MARGINS[3]}, ${MARGINS[0]})`);

async function getSeasonData(season) {
  if (season in seasonData) {
    return seasonData[season];
  }
  const response = await fetch(`${API_ROOT}?episode=${season}`);
  const data = (await response.json()).results.map(episode => ({
    label: episode.episode.slice(3),
    value: episode.characters.length
  }));
  seasonData[season] = data;
  return data;
}

async function drawChart() {
  const season = seasonSelect.property('value');
  const data = await getSeasonData(season);

  scaleX.domain(data.map(d => d.label));
  scaleY.domain([ 0, Math.max(...data.map(d => d.value)) ]);

  xAxisWrapper.call(axisX);
  yAxisWrapper.call(axisY);

  const bars = chartRoot.selectAll('rect').data(data);
  const rectWidth = scaleX.bandwidth();

  bars.enter()
    .append('rect')
      .attr('width', rectWidth)
      .attr('fill', 'red')
    .merge(bars)
      .attr('x', d => scaleX(d.label))
      .attr('y', d => scaleY(d.value))
      .attr('height', d => scaleY(0) - scaleY(d.value));

  bars.exit().remove();
}

let lastWidth;
function onResize() {
  const width = svgEl.clientWidth;
  if (lastWidth === width) return;

  lastWidth = width;
  const height = Math.round(width / CHART_RATIO);
  svgEl.style.height = `${height}px`;

  const innerWidth = width - MARGINS[1] - MARGINS[3];
  const innerHeight = height - MARGINS[0] - MARGINS[2];

  scaleX.rangeRound([ 0, innerWidth ]);
  scaleY.range([ innerHeight, 0 ]);

  xAxisWrapper.attr('transform', `translate(${MARGINS[3]}, ${MARGINS[1] + innerHeight})`);

  drawChart();
}

addEventListener('resize', onResize);
onResize();
