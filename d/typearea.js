/*
*    bar chart
*/


function createtypeareachart(xaxis, yaxis, lineval) {

  linevar = lineval

    // console.log('area printing')
    
    const MARGIN = { LEFT: 80, RIGHT: 100, TOP: 50 , BOTTOM: 90 }
    const WIDTH = 700 - MARGIN.LEFT - MARGIN.RIGHT
    aHEIGHT = 370 - MARGIN.TOP - MARGIN.BOTTOM
        
    const svg = d3.select('#type-area').append("svg")
      .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
      .attr("height", aHEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
        
    cg = svg.append("g")
      .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)
        
            // // line chart
    cx = d3.scaleBand()
      .range([0, WIDTH])
    //   .range([MARGIN.LEFT, WIDTH - MARGIN.RIGHT])
      .padding(0.1);
  
    cy = d3.scaleLinear()
      .range([aHEIGHT, 0])

    clineyScale = d3.scaleLinear()
    .rangeRound([aHEIGHT, 0])
  
              
    cxAxisGroup = cg.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${aHEIGHT})`)
  
    cyAxisGroup = cg.append("g")
      .attr("class", "y axis")
        
      
    // X label
    cg.append("text")
      .attr("class", "x axis-label")
      .attr("x", WIDTH / 2)
      .attr("y", aHEIGHT + 60)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
  
    // Y label
    Ylabel = cg.append("text")
      .attr("class", "y axis-label")
      .attr("x", - (aHEIGHT / 2))
      .attr("y", -60)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")

    // linelabel
    clineyAxisGroup = cg.append("g")
    .attr("class", "yaxis2")
    .attr("transform", `translate(${WIDTH}, 0)`)

    // Y label
    const Linelabel = cg.append("text")
      .attr("class", "y axis-label")
      .attr("x", - (aHEIGHT / 2) +10)
      .attr("y", WIDTH+60)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text('Avg Years Left on Lease')
        
  
    // const addLegend()
  
    updatetypearea(xaxis, yaxis, 'Avg Resale Price ($)')
  
  }
        
        
function updatetypearea(xaxis, yaxis, ylabel) {
    
    // console.log('updating area')

    const t = d3.transition().duration(600)

    cx.domain(xaxis)
    cy.domain([0, 
            d3.max(yaxis)])

    const xAxisCall = d3.axisBottom(cx)  
    cxAxisGroup
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

    const yAxisCall = d3.axisLeft(cy)
        .ticks(5)
        .tickFormat(d => lableCheck(d))
        cyAxisGroup
        .transition(t)
        .call(yAxisCall) 


        // tooltip
    var tooltip = cg
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background", "#000")
        .text("a simple tooltip");


            // draw bars
    const rects = cg.selectAll("rect")
    .data(xaxis)
    
    // delete gone bars
    rects.exit()
        .attr("class", "exit")
        .transition(t)
        .attr("height", 0)
        .attr("y", aHEIGHT)
        .style("fill-opacity", "0.1")
        .remove()

        //update repeat bars
    rects
        .attr("class", "update")
        .transition(t)
        .attr("y", (d, i) => cy(yaxis[i]))
        .attr("height", (d, i) => aHEIGHT - cy(yaxis[i]))
        .attr("x", d => cx(d))
        .attr("width", cx.bandwidth)

        //add new bars
    rects.enter().append("rect")
        .attr("class", "enter")
        .attr("y", cy(0))
        .attr("x", d => cx(d))
        .attr("width", cx.bandwidth)
        .attr("fill", "#1ABC9C")
        .transition(t)
        .attr("y", (d, i) => cy(yaxis[i]))
        .attr("height", (d, i) => aHEIGHT - cy(yaxis[i]))

    //     .on("mouseover", function(d){tooltip.text((d, i) => y(yaxis[i])); return tooltip.style("visibility", "visible");})
    // .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
    // .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
    
    
      // add line chart
      // console.log(linevar)
  clineyScale.domain([0,d3.max(linevar)])

  const lineAxisCall = d3.axisRight(clineyScale)
  // .ticks(5)
  //   .tickFormat(d => d)
  clineyAxisGroup
  .transition(t)
  .call(lineAxisCall)

  // const xaxis = Array.from(new Set(stackData.map((d) => d.town)))
  // draw line
  const lline = d3.line()
    .x(d => cx(d) + cx.bandwidth() / 2)
    .y((d, i) => clineyScale(linevar[i]))

  cg.selectAll("path.line").remove()

  cg.append("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "#236AED")
    .attr("stroke-width", "3px")
    .transition(t)
    .attr("d", lline(xaxis))

    // console.log('addline')
  
  
  // add label
    Ylabel.text(ylabel)  
    
}
      