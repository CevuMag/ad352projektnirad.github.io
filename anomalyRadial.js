// Plot constants
const MARGIN = {LEFT: 0, RIGHT: 0, TOP: 0, BOTTOM: 30};
const WIDTH = 500 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM;
const OUTERRADIUS = Math.min(WIDTH, HEIGHT, 500) / 2;
const INNERRADIUS = OUTERRADIUS * 0.1;

let svg,
  g,
  colorScale,
  distScale,
  radialScale,
  title,
  yearText,
  line,
  barWrapper,
  pathWrapper;

let currYear = 1901;

// Domain data
const domLow = -1.5, //-15, low end of data
  domHigh = 1.25, //30, high end of data
  axisTicks = [-1, 0, 1]; //[-20,-10,0,10,20,30];  [-2,-1,0,1,2,3];  [-1.5,-0.5,0.5,1.5];

function initChart(canvasElement) {
  // Vizualizacija canvas-a
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

  //Boja zasnovana na prosecnoj temperaturi
  colorScale = d3
    .scaleLinear()
    .domain([domLow, (domLow + domHigh) / 2, domHigh])
    .range(["#1788de", "#ffff8c", "#CE241C"]);

  //Skala za visinu bar-a, ne pocinja na 0 zbog incijalnog offset-a
  distScale = d3
    .scaleLinear()
    .range([INNERRADIUS, OUTERRADIUS])
    .domain([domLow, domHigh]);

  radialScale = d3
    .scaleLinear()
    .range([0, Math.PI * 2])
    .domain([1, 12]); // za 12 meseci

  // Titl

  barWrapper = svg
    .append("g")
    .attr("transform", "translate(" + WIDTH / 2 + "," + HEIGHT / 2 + ")");

  pathWrapper = barWrapper.append("g").attr("id", "pathWrapper");

  line = d3
    .lineRadial()
    .angle(function (d) {
      return radialScale(d.Month);
    })

}

function updateChart(data, nextYear) {
  const trans = d3.transition().duration(400).ease(d3.easeCubicIn);

  if (nextYear < currYear) {
    const paths = document.getElementById("pathWrapper").children;
    const removeRange = paths.length - (currYear - nextYear);
    const removeElems = [];
    for (let i = removeRange; i < paths.length; i++) {
      removeElems.push(paths[i]);
    }
    removeElems.forEach((elem) => elem.parentNode.removeChild(elem));
  } else if (nextYear > currYear) {
    for (let year = currYear; year < nextYear; year++) {
      const yearData = data.get(String(year));
      const path = pathWrapper
            .append("path")
            .attr("class", "line")
            .attr("stroke-width", 5)
            .attr("fill", "none")
            .attr("d", line(yearData))
            .attr("x", -0.75)
            .style("stroke", colorScale(yearData[0].Anomaly));

      const totalLength = path.node().getTotalLength();

      if ((nextYear-currYear) == 1) {
        path
          .attr("stroke-dasharray", totalLength + " " + totalLength)
          .attr("stroke-dashoffset", totalLength)
          .transition(trans)
          .attr("stroke-dashoffset", 0);
      }
    }
  }

  currYear = nextYear;
}

export {initChart, updateChart};
