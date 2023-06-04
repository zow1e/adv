/*
*    line chart
*/


function createlinechart(xaxis, yaxis) {

  // console.log('linechart printing')

  LMARGIN = { LEFT: 80, RIGHT: 100, TOP: 50, BOTTOM: 40 }
  LWIDTH = 700 - LMARGIN.LEFT - LMARGIN.RIGHT
  LHEIGHT = 370 - LMARGIN.TOP - LMARGIN.BOTTOM
    
  svg = d3.select('#line-chart').append("svg")
    .attr("width", LWIDTH + LMARGIN.LEFT + LMARGIN.RIGHT)
    .attr("height", LHEIGHT + LMARGIN.TOP + LMARGIN.BOTTOM)

  g = svg.append("g")
    .attr('class', 'lineg')
    .attr("transform", `translate(${LMARGIN.LEFT}, ${LMARGIN.TOP})`)

  
  
      // // line chart
  ax = d3.scaleTime()
  .range([0, LWIDTH])

  ay = d3.scaleLinear()
    .range([LHEIGHT, 0])
    
  axAxisGroup = g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${LHEIGHT})`)
  
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
    .attr("x", LWIDTH / 2)
    .attr("y", LHEIGHT + 60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Year")

    // Y label
  aYlabel = g.append("text")
    .attr("class", "y axis-label")
    .attr("x", - (LHEIGHT / 2))
    .attr("y", -60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
  
  updateline(xaxis, yaxis, 'Avg Resale Price ($)')

}
  
  
function updateline(xaxis, yaxis, ylabel) {

  // console.log(xaxis)

  // console.log('updating line')

  data = []
  //combined dataset
  xaxis.forEach((d, i )=> {
    data.push({
      'date': d,
      'value': yaxis[i]
    })
  })

  // console.log(data)


  const t = d3.transition().duration(600)

  // const value = flag ? "remainingyrs" : "resale_price";

  ax.domain(d3.extent(xaxis))
  ay.domain([0, d3.max(yaxis)*1.05])


  function changetostring(dateobj) {
    obj = String(dateobj).length
    if (obj == 4) {
      return dateobj }
    else if (obj == 6) {
      const timeParse = d3.timeParse('%m/%Y')
      const formatTime = d3.timeFormat("%b %Y")
      return formatTime(timeParse(dateobj)) }
    else if (obj == 2) {
      const timeParse = d3.timeParse('%m')
      const formatTime = d3.timeFormat("%b")
      return formatTime(timeParse(dateobj)) }
  }

      
  const xAxisCall = d3.axisBottom(ax)
  .tickValues(xaxis)

  .tickFormat((d) => changetostring(d))
  // .innerTickSize(-HEIGHT)
  // .tickFormat((d) => formatTime(d))

  axAxisGroup
  .transition(t).call(xAxisCall)  
    .selectAll("text")
      .attr("y", "10")
      .attr("x", "-5")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-40)")
          
  function lableCheck(d) {
    if (ylabel == 'Avg Floor Area (Sqm)' || ylabel == 'Count of Units'){
      return d
    }
    else if (ylabel == 'Avg Resale Price ($)'){
      return "$" + d
    }
  }

  const yAxisCall = d3.axisLeft(ay)
    .ticks(6)
    .tickFormat(d => lableCheck(d))
    ayAxisGroup
    .transition(t)
    .call(yAxisCall) 


  g.selectAll("path.line").remove()

      // draw line
  let line = d3.line()
    .x(d => ax(d.date))
    .y(d=> ay(d.value))
    

  g.append("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "blue")
    .attr("stroke-width", "3px")
    .transition(t)
    .attr("d", line(data))

  aYlabel.text(ylabel)


  //tooltip
  const bisectDate = d3.bisector(xaxis, d => d).left

  const focus = g.append("g")
		.attr("class", "focus")
		.style("display", "none")

	focus.append("line")
		.attr("class", "x-hover-line hover-line")
		.attr("y1", 0)
		.attr("y2", LHEIGHT)

	focus.append("line")
		.attr("class", "y-hover-line hover-line")
		.attr("x1", 0)
		.attr("x2", LWIDTH)

	focus.append("circle")
		.attr("r", 7.5)

	focus.append("text")
		.attr("x", 15)
		.attr("dy", ".31em")

	svg.append("rect")
		.attr("class", "overlay")
		.attr("width", LWIDTH)
		.attr("height", LHEIGHT)
		.on("mouseover", () => focus.style("display", null))
		.on("mouseout", () => focus.style("display", "none"))
		.on("mousemove", mousemove)
		.on('click', mouseClick)

	function mouseClick() {
		console.log("mouseClick")
	}

	function mousemove() {
    console.log(d3.pointer(yaxis))
		const x0 = ax.invert(d3.pointer(xaxis))
		const i = bisectDate(data, x0, 1)
		const d0 = data[i - 2]
		const d1 = data[i - 1]
		const d = x0 - d0.year > d1.year - x0 ? d1 : d0
    console.log(d)
		focus.attr("transform", `translate(${ax(d.date)}, ${ay(d.value)})`)
		focus.select("text").text(d.value)
		focus.select(".x-hover-line").attr("y2", LHEIGHT - ay(d.value))
		focus.select(".y-hover-line").attr("x2", -ax(d.date))
	}
}
