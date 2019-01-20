const { select, sum, interpolate, arc, pie } = d3;

const data = [38024.7, 209484.6, 6201.2, 17741.9, 24377.7];
const total = sum(data);

const width = select('svg').node().clientWidth;

const svgs = select('section')
  .selectAll('svg')
  .style('height', `${width}px`);

svgs.append('g').attr('transform', `translate(${width / 2}, ${width / 2})`);

const colors = 'blue red maroon gray orange'.split(' ');

const sectorArc = arc()
  .innerRadius(width / 4)
  .outerRadius(width / 2.5);

const tweens = [
  function(sectorData) {
    const currentPath = this.getAttribute('d');
    return interpolate(currentPath, sectorArc(sectorData));
  },
  function(sectorData) {
    const interpolator = interpolate(this._current, sectorData);
    this._current = interpolator(0);
    return t => sectorArc(interpolator(t));
  }
];

function drawCharts(data) {
  const pieData = pie().sort(null)(data);
  svgs.each(function(_, index) {
    const svg = select(this);
    const sectors = svg
      .select('g')
      .selectAll('path')
      .data(pieData);

    sectors
      .enter()
      .append('path')
      .attr('fill', (_, i) => colors[i])
      .attr('d', sectorArc)
      .property('_current', d => d);

    sectors
      .transition()
      .duration(3000)
      .attrTween('d', tweens[index]);
  });
}

drawCharts(data);

let isEven = false;
select('button').on('click', () => {
  isEven = !isEven;
  drawCharts(isEven ? [...data].fill(total / data.length) : data);
});
