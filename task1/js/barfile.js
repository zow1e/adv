/*
*    bar chart
*/


function createbarchart(xaxis, yaxis) {

  console.log('barchart printing')
  
  const MARGIN = { LEFT: 80, RIGHT: 100, TOP: 50 , BOTTOM: 150 }
  const WIDTH = 700 - MARGIN.LEFT - MARGIN.RIGHT
  BHEIGHT = 420 - MARGIN.TOP - MARGIN.BOTTOM
      
  const svg = d3.select('#bar-chart').append("svg")
    .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr("height", BHEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
      
  bg = svg.append("g")
    .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)
      
          // // line chart
  x = d3.scaleBand()
    .range([0, WIDTH])
  //   .range([MARGIN.LEFT, WIDTH - MARGIN.RIGHT])
    .padding(0.1);

  y = d3.scaleLinear()
    .range([BHEIGHT, 0])

            
  bxAxisGroup = bg.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${BHEIGHT})`)

  byAxisGroup = bg.append("g")
    .attr("class", "y axis")
      
    
  // X label
  bg.append("text")
    .attr("class", "x axis-label")
    .attr("x", WIDTH / 2)
    .attr("y", BHEIGHT + 60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")

  // Y label
  bYlabel = bg.append("text")
    .attr("class", "y axis-label")
    .attr("x", - (BHEIGHT / 2))
    .attr("y", -60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
      

  // const addLegend()

  updatebar(xaxis, yaxis, 'Avg Resale Price ($)')

}
      
      
function updatebar(xaxis, yaxis, ylabel) {
    
  console.log('updating bar')
  
  const t = d3.transition().duration(600)

  x.domain(xaxis)
  y.domain([0, d3.max(yaxis)])
  
  const xAxisCall = d3.axisBottom(x)  

  bxAxisGroup
  .transition(t).call(xAxisCall)  
    .selectAll("text")
      .attr("y", "10")
      .attr("x", "-5")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-40)")

  const yAxisCall = d3.axisLeft(y)
    .ticks(5)
    .tickFormat(d => "$"+d)
    byAxisGroup
    .transition(t)
    .call(yAxisCall) 


    // tooltip
    var tooltip = bg
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("background", "#000")
      .text("a simple tooltip");


        // draw bars
  const rects = bg.selectAll("rect")
    .data(xaxis)
    
    // delete gone bars
    rects.exit()
        .attr("class", "exit")
        .transition(t)
        .attr("height", 0)
        .attr("y", BHEIGHT)
        .style("fill-opacity", "0.1")
        .remove()

        //update repeat bars
    rects
        .attr("class", "update")
        .transition(t)
        .attr("y", (d, i) => y(yaxis[i]))
        .attr("height", (d, i) => BHEIGHT - y(yaxis[i]))
        .attr("x", d => x(d))
        .attr("width", x.bandwidth)

        //add new bars
    rects.enter().append("rect")
        .attr("class", "enter")
        .attr("y", y(0))
        .attr("x", d => x(d))
        .attr("width", x.bandwidth)
        .attr("fill", "mediumseagreen") 
        // .on("click", drill)
        // .style("height", function(d) {
            // return d + "px"})
        .transition(t)
        .attr("y", (d, i) => y(yaxis[i]))
        .attr("height", (d, i) => BHEIGHT - y(yaxis[i]))

        // .addEventListener("mouseover", function (actual, i) {

        // .on('click', function (actual, i) {
        //   d3.selectAll('.value')
        //     .attr('opacity', 0)
  
        //   d3.select(this)
        //     .transition()
        //     .duration(300)
        //     .attr('opacity', 0.6)
        //     .attr('x', (a) => x(a.language) - 5)
        //     .attr('width', xScale.bandwidth() + 10) })

      //   .on("mouseover", function(d){tooltip.text((d, i) => y(yaxis[i])); return tooltip.style("visibility", "visible");})
      // .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
      // .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
    
    
    bYlabel.text(ylabel)
      

      }
    