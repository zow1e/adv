/*
*    bar chart
*/


class BarChart {
  constructor(_parentElement, _firstdata) {
    this.parentElement = _parentElement
    this.firstdata = _firstdata

    this.initVis()
  }

  initVis() {
    const vis = this
  
  vis.MARGIN = { LEFT: 100, RIGHT: 100, TOP: 50 , BOTTOM: 85 }
  vis.WIDTH = 690 - vis.MARGIN.LEFT - vis.MARGIN.RIGHT
  vis.HEIGHT = 400 - vis.MARGIN.TOP - vis.MARGIN.BOTTOM
      
  vis.svg = d3.select(vis.parentElement).append("svg")
      .attr("width", vis.WIDTH + vis.MARGIN.LEFT + vis.MARGIN.RIGHT)
      .attr("height", vis.HEIGHT + vis.MARGIN.TOP + vis.MARGIN.BOTTOM)

    vis.g = vis.svg.append("g")
      .attr("transform", `translate(${vis.MARGIN.LEFT}, ${vis.MARGIN.TOP})`)

    // vis.linePath = vis.g.append("path")
    //   .attr("class", "line")
    //   .attr("fill", "none")
    //   .attr("stroke-width", "3px")

    vis.x = d3.scaleBand()
      .range([0, vis.WIDTH])
      .padding(0.3)

    vis.y = d3.scaleLinear().range([vis.HEIGHT, 0])

    vis.xAxisgroup = vis.g.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${vis.HEIGHT})`)

    vis.yAxisgroup = vis.g.append("g")
      .attr("class", "y axis")

    vis.yLabel = vis.g.append("text")
      .attr("class", "title")
      .attr("y", -15)
      .attr("x", -50)
      .attr("font-size", "12px")
      .attr("text-anchor", "start")

    // line chart
    vis.lineyAxisgroup = vis.g.append("g")
      .attr("class", "yaxis2")
      .attr("transform", `translate(${vis.WIDTH}, 0)`)
    
    vis.lineyLabel = vis.g.append("text")
      .attr("class", "title")
      .attr("y", -15)
      .attr("x", vis.WIDTH-50)
      .attr("font-size", "12px")
      .attr("text-anchor", "start")
      .text('Avg Years Left on Lease')

    vis.liney = d3.scaleLinear()
      .rangeRound([vis.HEIGHT, 0])

    vis.wrangleData(vis.firstdata)
  }


  wrangleData(_data) {
    const vis = this
    this.data = _data

    const value = $("#var-select").val()
    
    const xAxis = Array.from(new Set(vis.data.map((d) => d.flat_model)))
    
    const valuecheck = checkval(value, 'flat_model', vis.data)
    const yAxis = valuecheck[0]
    vis.label = valuecheck[1]

    vis.dataFiltered = createNest(xAxis, yAxis)
    vis.yLabel.text(vis.label)

    const datagroup = d3.group(vis.data, d => d.flat_model)
    vis.flatall = Array.from(datagroup.keys())

    //line chart
    vis.lineval = calcs.avg('remainingyrs', 'flat_model', vis.data)
    vis.lineNest = createNest(xAxis, vis.lineval)
    

    vis.updateVis()
  }

  updateVis() {
    const vis = this

    vis.t = d3.transition().duration(1000)

    // update scales
    vis.x.domain(vis.flatall)
    vis.y.domain([0, d3.max(vis.dataFiltered, d => d.value)])
    vis.liney.domain([0, d3.max(vis.lineval)])
    // update axes
    vis.yAxisgroupCall = d3.axisLeft(vis.y)
    .ticks(6)
    .tickFormat(d => lableCheck(d, vis.label))
    vis.yAxisgroup
    .transition(vis.t)
    .call(vis.yAxisgroupCall)
    

    vis.xAxisgroupCall = d3.axisBottom(vis.x)
      .tickValues(vis.dataFiltered.map(d => d.key))
      .tickFormat(d => d)
    vis.xAxisgroup
      .transition(vis.t)
      .call(vis.xAxisgroupCall)  
      .selectAll("text")
        .attr("y", "10")
        .attr("x", "-5")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-40)")

    vis.lineyAxisgroupCall = d3.axisRight(vis.liney)
      .ticks(6)
      .tickFormat(d => d)
    vis.lineyAxisgroup
      .transition(vis.t)
      .call(vis.lineyAxisgroupCall)

    // add bars
      vis.rects = vis.g.selectAll("rect")
      .data(vis.dataFiltered, d => d.key)

    vis.rects.exit()
      .attr("class", "exit")
      .transition(vis.t)
        .attr("height", 0)
        .attr("y", vis.HEIGHT)
        .style("fill-opacity", "0.1")
        .remove()

    vis.rects
      .attr("class", "update")
      .transition(vis.t)
        .attr("y", d => vis.y(d.value))
        .attr("height", d => (vis.HEIGHT - vis.y(d.value)))
        .attr("x", d => vis.x(d.key))
        .attr("width", vis.x.bandwidth)

    vis.rects.enter().append("rect")
      .attr("class", "enter")
      .attr("y", d => vis.y(d.value))
      .attr("height", d => (vis.HEIGHT - vis.y(d.value)))
      .attr("x", d => vis.x(d.key))
      .attr("width", vis.x.bandwidth)
      .attr("fill", "mediumseagreen")
      .transition(vis.t)

      // draw line
      vis.line = d3.line()
        .x(d => vis.x(d.key) + vis.x.bandwidth() / 2)
        .y(d=> vis.liney(d.value))

  
    vis.g.selectAll("path.line").remove()
    
    vis.g.append("path")
          .attr("class", "line")
          .attr("fill", "none")
          .attr("stroke", "blue")
          .attr("stroke-width", "3px")
          .transition(vis.t)
          .attr("d", vis.line(vis.lineNest))
  }
}
    