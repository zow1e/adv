/*
*    line chart
*/


function createlinechart(xaxis, yaxis) {

  console.log('linechart printing')

  const MARGIN = { LEFT: 80, RIGHT: 100, TOP: 50, BOTTOM: 40 }
  const WIDTH = 700 - MARGIN.LEFT - MARGIN.RIGHT
  const HEIGHT = 370 - MARGIN.TOP - MARGIN.BOTTOM
    
  const svg = d3.select('#line-chart').append("svg")
    .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

  g = svg.append("g")
    .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)
  
      // // line chart
  ax = d3.scaleTime()
  .range([0, WIDTH])

  ay = d3.scaleLinear()
    .range([HEIGHT, 0])
    
  axAxisGroup = g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${HEIGHT})`)
  
  ayAxisGroup = g.append("g")
    .attr("class", "y axis")

  // grid
  var gridline = fc.annotationSvgGridline()
    .xScale(ax)
    .yScale(ay);
  
  g.append("g")
    .call(gridline);


    // X label
  g.append("text")
    .attr("class", "x axis-label")
    .attr("x", WIDTH / 2)
    .attr("y", HEIGHT + 60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Year")

    // Y label
  Ylabel = g.append("text")
    .attr("class", "y axis-label")
    .attr("x", - (HEIGHT / 2))
    .attr("y", -60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
  
  updateline(xaxis, yaxis, 'Avg Resale Price ($)')

}
  
  
function updateline(xaxis, yaxis, ylabel) {

  console.log('updating line')


  const t = d3.transition().duration(600)

  // const value = flag ? "remainingyrs" : "resale_price";

  ax.domain(d3.extent(xaxis))
  // x.domain(xaxis)
  ay.domain([d3.min(yaxis), 
            d3.max(yaxis)])

  // const formatTime = d3.timeFormat("%b %Y")

  // function changetostring(dateobj) {
  //   return formatTime(dateobj)
  // }
  // svg
  // .append("g")
  // .call(d3.axisBottom(ax).ticks(10).tickSizeInner(-HEIGHT))
      
  const xAxisCall = d3.axisBottom()
  .scale(ax)
  .tickValues(xaxis)
  .tickFormat((d) => d)
  // .innerTickSize(-HEIGHT)
  // .tickFormat((d) => formatTime(d))

  axAxisGroup
  .transition(t).call(xAxisCall)  
    .selectAll("text")
      .attr("y", "10")
      .attr("x", "-5")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-40)")
          
    
  const yAxisCall = d3.axisLeft(ay)
    .ticks(5)
    .tickFormat(d => "$"+d)
    ayAxisGroup
    .transition(t)
    .call(yAxisCall) 


  d3.selectAll("path.line").remove();

      // draw line
  let line = d3.line()
    .x(d => ax(d))
    .y((d, i) => ay(yaxis[i]))
    

      // line
  console.log('line wrong conversion',yaxis)

  g.append("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "blue")
    .attr("stroke-width", "3px")
    // .transition(t)
    .attr("d", line(xaxis))

      // g.append("path")
		  // .transition(t)
      // // .datum(xaxis)
      // .attr("class", "line")
      // .attr("fill", "none")
      // .attr("stroke", "blue")
      // .attr("stroke-width", "3px")
      // .attr("d", line(xaxis))

    
      // const flagtxt = flag ? "Avg Revenue ($)" : "Profit ($)"
  Ylabel.text(ylabel)


  }
