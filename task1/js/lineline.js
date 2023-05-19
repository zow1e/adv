/*
*    line chart
*/


function createlinechart(xaxis, yaxis) {

  console.log('linechart printing')

  MARGIN = { LEFT: 80, RIGHT: 100, TOP: 50, BOTTOM: 40 }
  WIDTH = 700 - MARGIN.LEFT - MARGIN.RIGHT
  HEIGHT = 370 - MARGIN.TOP - MARGIN.BOTTOM
    
  const svg = d3.select('#line-chart').append("svg")
    .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

  g = svg.append("g")
    .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)
  
      // // line chart
  x = d3.scaleTime()
    .rangeRound([0, WIDTH])

  y = d3.scaleLinear()
    .range([HEIGHT, 0])
    
  xAxisGroup = g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${HEIGHT})`)
  
  yAxisGroup = g.append("g")
    .attr("class", "y axis")


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
  
      // const stack = d3.stack()
      //   .keys(["west", "south", "northeast", "midwest"])
  
      // const area = d3.area()
      //   .x(d => const x(parseTime(d.data.date)))
      //   .y0(d => const y(d[0]))
      //   .y1(d => const y(d[1]))
  
      // const addLegend()
  
      updateline(xaxis, yaxis, 'Avg Resale Price ($)')

}
  
  
    function updateline(xaxis, yaxis, ylabel) {

      console.log('updating line')
      // console.log(xaxis)


      // const dayNest = d3.nest()
      //   .key(d => formatTime(d.date))
      //   .entries(calls)
  
      // const dataFiltered = const dayNest
      //   .map(day => day.values.reduce(
      //     (accumulator, current) => {
      //         accumulator.date = day.key
      //         accumulator[current.team] = accumulator[current.team] + current[const variable]
      //         return accumulator
      //     }, {
      //       "northeast": 0,
      //       "midwest": 0,
      //       "south": 0,
      //       "west": 0
      //     }
      //   ))
  
    //   updateVis()
    // }
  
    // updateVis() {

    // var years = window.yrs
    // var rpriceavg = window.resalepriceavg

  
      const t = d3.transition().duration(600)
  
      // const value = flag ? "remainingyrs" : "resale_price";
    
      x.domain(d3.extent(xaxis))

      y.domain([d3.min(yaxis), 
                d3.max(yaxis)])
      
      const xAxisCall = d3.axisBottom(x)
      .tickValues(xaxis)
      .tickFormat((d) => d)

      xAxisGroup
      .transition(t).ease(d3.easeLinear).call(xAxisCall)  
        .selectAll("text")
          .attr("y", "10")
          .attr("x", "-5")
          .attr("text-anchor", "end")
          .attr("transform", "rotate(-40)")
          
    
        yAxisCall = d3.axisLeft(y)
        .ticks(3)
        .tickFormat(d => "$"+d)
        yAxisGroup
        .transition(t)
        .call(yAxisCall) 

      d3.selectAll("path.line").remove();

      // draw line
      const line = d3.line()
      .x(d => x(d))
      .y((d, i) => y(yaxis[i]))

      g.append("path")
		  .transition(t)
      // .datum(xaxis)
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", "3px")
      .attr("d", line(xaxis))
      
      console.log(typeof xaxis[0])

    
      // const flagtxt = flag ? "Avg Revenue ($)" : "Profit ($)"
     Ylabel.text(ylabel)
    // }
  
    // addLegend() {
    //   const vis = this
  
    //   const legend = g.append("g")
    //     .attr("transform", "translate(50, -25)")
  
    //   const legendArray = [
    //     { label: "Northeast", color: color("northeast") },
    //     { label: "West", color: color("west") },
    //     { label: "South", color: color("south") },
    //     { label: "Midwest", color: color("midwest" )}
    //   ]
  
    //   const legendCol = legend.selectAll(".legendCol")
    //     .data(legendArray)
    //     .enter().append("g")
    //       .attr("class", "legendCol")
    //       .attr("transform", (d, i) => `translate(${i * 100}, 0)`)
          
    //   legendCol.append("rect")
    //     .attr("class", "legendRect")
    //     .attr("width", 10)
    //     .attr("height", 10)
    //     .attr("fill", d => d.color)
    //     .attr("fill-opacity", 0.5)
  
    //   legendCol.append("text")
    //     .attr("class", "legendText")
    //     .attr("x", 20)
    //     .attr("y", 10)
    //     .attr("text-anchor", "start")
    //     .text(d => d.label)
    // };

  }
