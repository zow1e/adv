/*
*    line chart
*/


function createlinechart(xaxis, yaxis) {

  console.log('linechart printing')

  const MARGIN = { LEFT: 80, RIGHT: 100, TOP: 50, BOTTOM: 40 }
  WIDTH = 700 - MARGIN.LEFT - MARGIN.RIGHT
  HEIGHT = 370 - MARGIN.TOP - MARGIN.BOTTOM
    
  const svg = d3.select('#line-chart').append("svg")
    .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

  g = svg.append("g")
    .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

  const bisectDate = d3.bisector(xaxis, d => d).left
  
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
  // ay.domain([d3.min(yaxis)/1.05,
  ay.domain([0, 
            d3.max(yaxis)*1.05])

  // const formatTime = d3.timeFormat("%b %Y")

  // function changetostring(dateobj) {
  //   return formatTime(dateobj)
  // }
  // svg
  // .append("g")
  // .call(d3.axisBottom(ax).ticks(10).tickSizeInner(-HEIGHT))
      
  const xAxisCall = d3.axisBottom(ax)
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
    .ticks(6)
    .tickFormat(d => "$"+d)
    ayAxisGroup
    .transition(t)
    .call(yAxisCall) 


  // d3.selectAll("path.line").remove();

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

  Ylabel.text(ylabel)


  // //tooltip

  // const tooltip = g.append('g')
  // .attr('class', 'focus')
  // .attr('display', 'none')

  // tooltip.append('line')
  // .attr('class', 'x-hover-line hover-line')
  // .attr('y', HEIGHT)
  // .attr('x', 0)

  // tooltip.append('circle')
  // .attr('r', 7)

  // tooltip.append('text')
  // .attr('x', 15)
  // .attr('dy', '.31em')

  // g.append('rect')
  // .attr('class', 'overlay')
  // .attr('x', WIDTH)
  // .attr('y', HEIGHT)
  // .on("mouseover", () => focus.style("display", null))
	// 	.on("mouseout", () => focus.style("display", "none"))
	// 	.on("mousemove", mousemove)

	// function mousemove() {
	// 	const x0 = ax.invert(d3.mouse(this)[0])
	// 	const i = bisectDate(xaxis, x0, 1)
	// 	const d0 = xaxis[i - 1]
	// 	const d1 = xaxis[i]
	// 	const d = x0 - d0 > d1 - x0 ? d1 : d0
	// 	focus.attr("transform", `translate(${ax(d)}, ${(d, i) => ay(yaxis[i])})`)
	// 	focus.select("text").text((d, i) => (yaxis[i]))
	// 	focus.select(".x-hover-line").attr("y2",(d, i) => HEIGHT - ay(yaxis[i]))
	// 	focus.select(".y-hover-line").attr("x2", (d, i) => -ax(yaxis[i]))
  // }
}
