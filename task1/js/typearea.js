/*
*    bar chart
*/


function createtypeareachart(xaxis, yaxis) {

    console.log('area printing')
    
    MARGIN = { LEFT: 80, RIGHT: 100, TOP: 10 , BOTTOM: 170 }
    WIDTH = 700 - MARGIN.LEFT - MARGIN.RIGHT
    HEIGHT = 420 - MARGIN.TOP - MARGIN.BOTTOM
        
    const svg = d3.select('#type-area').append("svg")
      .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
      .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
        
    cg = svg.append("g")
      .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)
        
            // // line chart
    cx = d3.scaleBand()
      .range([0, WIDTH])
    //   .range([MARGIN.LEFT, WIDTH - MARGIN.RIGHT])
      .padding(0.1);
  
    cy = d3.scaleLinear()
      .range([HEIGHT, 0])
  
              
    cxAxisGroup = cg.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${HEIGHT})`)
  
    cyAxisGroup = cg.append("g")
      .attr("class", "y axis")
        
      
    // X label
    cg.append("text")
      .attr("class", "x axis-label")
      .attr("x", WIDTH / 2)
      .attr("y", HEIGHT + 60)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
  
    // Y label
    Ylabel = cg.append("text")
      .attr("class", "y axis-label")
      .attr("x", - (HEIGHT / 2))
      .attr("y", -60)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
        
  
    // const addLegend()
  
    updatetypearea(xaxis, yaxis, 'Avg Resale Price ($)')
  
  }
        
        
function updatetypearea(xaxis, yaxis, ylabel) {
    
    console.log('updating area')

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

    const yAxisCall = d3.axisLeft(cy)
        .ticks(5)
        .tickFormat(d => "$"+d)
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
        .attr("y", HEIGHT)
        .style("fill-opacity", "0.1")
        .remove()

        //update repeat bars
    rects
        .attr("class", "update")
        .transition(t)
        .attr("y", (d, i) => cy(yaxis[i]))
        .attr("height", (d, i) => HEIGHT - cy(yaxis[i]))
        .attr("x", d => cx(d))
        .attr("width", cx.bandwidth)

        //add new bars
    rects.enter().append("rect")
        .attr("class", "enter")
        .attr("y", cy(0))
        .attr("x", d => cx(d))
        .attr("width", cx.bandwidth)
        .attr("fill", "dodgerblue")
        .transition(t)
        .attr("y", (d, i) => cy(yaxis[i]))
        .attr("height", (d, i) => HEIGHT - cy(yaxis[i]))

    //     .on("mouseover", function(d){tooltip.text((d, i) => y(yaxis[i])); return tooltip.style("visibility", "visible");})
    // .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
    // .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
    
    
        Ylabel.text(ylabel)
    
}
      