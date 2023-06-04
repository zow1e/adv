/*
*    bar chart
*/



function createstacked(data, linedata) {

  // console.log('stacked printing')
  
  MARGIN = { LEFT: 80, RIGHT: 250, TOP: 50 , BOTTOM: 150 }
  WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT
  HEIGHT = 420 - MARGIN.TOP - MARGIN.BOTTOM
      
  const svg = d3.select('#stacked').append("svg")
    .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
      
  kg = svg.append("g")
    .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)
      
  kxScale = d3.scaleBand()
    .range([0, WIDTH])
    .padding(0.1)
  
  kyScale = d3.scaleLinear()
    .range([HEIGHT, 0])

  lineyScale = d3.scaleLinear()
  .rangeRound([HEIGHT, 0])

            
  kxAxisGroup = kg.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${HEIGHT})`)

  kyAxisGroup = kg.append("g")
    .attr("class", "y axis")

  lineyAxisGroup = kg.append("g")
  .attr("class", "yaxis2")
  .attr("transform", `translate(${WIDTH}, 0)`)

  colorScale = d3.scaleOrdinal()
  .range(d3.schemeCategory10)
          
    
  // X label
  kg.append("text")
    .attr("class", "x axis-label")
    .attr("x", WIDTH / 2)
    .attr("y", HEIGHT + 60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")

  // Y label
  kYlabel = kg.append("text")
    .attr("class", "y axis-label")
    .attr("x", - (HEIGHT / 2))
    .attr("y", - 60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")

  // LINE LABEL
  // Y label
  kLinelabel = kg.append("text")
    .attr("class", "y axis-label")
    .attr("x", - (HEIGHT / 2))
    .attr("y", WIDTH+70)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")

    wrangleStacked(data, linedata)
    // updatestacked(data, 'Count', linedata, 'Avg Resale Price ($)', 'town')
  addLegend()

}

function wrangleStacked(data, linedata) {

  keystype = Array.from(new Set(data.map((d) => d.flat_type)))
  colorScale.domain(keystype)
  kxScale.domain(data.map(d => d.town))


  // console.log(flattypeall)
  function matrixData() {
    const rollups = d3
      .rollups(
        data.filter(d => d.flat_type),
        v => {
          const o = {};
          flattypeall.forEach(p => (o[p] = 0));
          v.forEach(d => (o[d.flat_type] = v.length));
          return o;
        },
        d => d.town
      )
      .map(d => ({ town: d[0], ...d[1] }))

    const last = rollups[rollups.length - 1]

    return Object.assign(rollups, {
      columns: [...Object.keys(last)].sort((a, b) =>
        d3.descending(last[a], last[b])
      )
    })
  }

  ss = matrixData()

  updatestacked('Count', linedata, 'Avg Resale Price ($)')

}
      
      
function updatestacked(ylabel, linevar, linelabel) {
  // newdata = filterTown(ff, data)
  // wrangleStacked(data)
    
  // console.log('updating stacked')

  // const xaxis = Array.from(new Set(data.map((d) => d.town)))
  
  const t = d3.transition().duration(600)

  const stacked = d3.stack().keys(keystype)
  const stackedData = stacked(ss)

  const ymax = d3.max(stackedData, d => {
    return d3.max(d, d => {
        return d[1]
    }) })
  kyScale.domain([0, ymax])


  const xAxisCall = d3.axisBottom(kxScale) 
  kxAxisGroup
  .transition(t).call(xAxisCall)  
  .selectAll("text")
      .attr("y", "10")
      .attr("x", "-5")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-40)")
  
  const yAxisCall = d3.axisLeft(kyScale)
  // .ticks(7)
  //   .tickFormat(d => d)
  kyAxisGroup
  .transition(t)
  .call(yAxisCall) 


      // Show the bars
  const rects = kg
  .append("g")
  .selectAll("rect")
  .data(stackedData)
  // console.log(stackedData)

  //exit old bars
  rects.selectAll("g").selectAll("rect").exit()
  .attr("class", "exit")
  .transition(t)
  .attr("height", 0)
  .attr("y", HEIGHT)
  .style("fill-opacity", "0.1")
  .remove()

  //update repeat bars
  rects
  .attr("class", "update")
    // enter a second time = loop subgroup per subgroup to add all rectangles
    .selectAll("rect")
    .data(d => d )
    .transition(t)
      .attr("x", d =>  kxScale(d.data.town))
      .attr("y", d =>  kyScale(d[1]))
      .attr("height", d =>  kyScale(d[0]) - kyScale(d[1]))
      .attr("width",kxScale.bandwidth)


  // Enter in the stack data = loop key per key = group per group
  rects.enter().append("g")
    .attr("fill", d => colorScale(d.key))
    .selectAll("rect")
    // enter a second time = loop subgroup per subgroup to add all rectangles
    .data(d => d )
    .enter().append("rect")
      .attr("y", y(0))
      .attr("x", d => x(d))
      .attr("width", x.bandwidth)
    // .transition(t)
      .attr("x", d =>  kxScale(d.data.town))
      .attr("y", d =>  kyScale(d[1]))
      .attr("height", d =>  kyScale(d[0]) - kyScale(d[1]))
      .attr("width",kxScale.bandwidth)

  
      // console.log(linevar)

    
  // add line chart
  lineyScale.domain([0,d3.max(linevar)])

  const lineAxisCall = d3.axisRight(lineyScale)
  // .ticks(5)
  //   .tickFormat(d => d)
  lineyAxisGroup
  .transition(t)
  .call(lineAxisCall)

  const xaxis = Array.from(new Set(ss.map((d) => d.town)))
  // draw line
  const lline = d3.line()
    .x(d => kxScale(d) + kxScale.bandwidth() / 2)
    .y((d, i) => lineyScale(linevar[i]))

  kg.selectAll("path.line").remove()

  kg.append("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "#236AED")
    .attr("stroke-width", "3px")
    .transition(t)
    .attr("d", lline(xaxis))

    // console.log('addline')
  
  
  // add label
    kYlabel.text(ylabel)  
    kLinelabel.text(linelabel)

}

function addLegend() {

  const flatModels = keystype
      
  const legend = kg.append("g")
  .attr("class", "legend")
  .attr("transform", `translate(${WIDTH+100}, ${HEIGHT-200})`)

  flatModels.forEach((model, i) => {
      const legendrow = legend.append('g')
              .attr("transform", `translate(0, ${i * 20})`)

      legendrow.append('rect')
      .attr('width', 10)
      .attr('height', 10)
      .attr('fill', colorScale(model))

      legendrow.append('text')
      .attr('x', 20)
      .attr('y', 10)
      .style("text-transform", "capitalize")
      .attr("font-size", "13px")
      .text(model)
      
  })
}
    