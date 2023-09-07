// Plot constants
const MARGIN = {LEFT: 10, RIGHT: 10, TOP: 10, BOTTOM: 10};
const WIDTH = 500 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM;
const INNERRADIUS = 60;
const OUTERRADIUS = Math.min(WIDTH, HEIGHT) / 2;

let svg,
  g,
  x,
  y,
  colorScale,
  xAxisGroup,
  yAxisGroup,
  title,
  subtitle,
  tooltip,
  tipMonth,
  hovMonth,
  tipData;
let hovered = false;
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function initChart(canvasElement) {
  // Vizalizacija canvas-a
  svg = d3
    .select(canvasElement)
    .append("svg")
    .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

  g = svg
    .append("g")
    .attr(
      "transform",
      "translate(" + WIDTH / 2 + "," + (HEIGHT / 2 + 20) + ")"
    );

  // Skale
  x = d3
    .scaleBand()
    .range([0, 2 * Math.PI])
    .align(0)
    .domain(monthNames);
  y = d3.scaleLinear().range([INNERRADIUS, OUTERRADIUS]).domain([-40, 35]);


  title = g
    .append("g")
    .attr("class", "title")
    .append("text")
    .attr("dy", "0.2em")
    .attr("text-anchor", "middle");

  subtitle = g
    .append("text")
    .attr("dy", "1.3em")
    .attr("text-anchor", "middle")
    .attr("opacity", 0.6);

  // Tooltip placeholder
  tooltip = d3.select(".tooltip");
}

function updateChart(data) {
  const trans = d3.transition().duration(400);

  title.text(data[0].ISO3);

  subtitle.text(data[0].Year);

  const bars = g.selectAll("path").data(data);

  bars.exit().remove();


  // Update tooltip data
  if (hovered) {
    hovMonth = monthNames.findIndex((month) => month == tipMonth);
    tipData =
      hovMonth != -1 ? data[hovMonth] : {Statistics: "", Temperature: ""};
    tooltip.html(tipData.Statistics + "<br/>" + tipData.Temperature + "℃");
  }
}

export {initChart, updateChart};
