/*
*    bar chart
*/


class subLine {
  
    constructor(_parentElement, _data, _WIDTH, _HEIGHT, _x, _xValue, _yValue, _ylabel) {
      this.data = _data
      this.g = _parentElement
      this.WIDTH = _WIDTH
      this.HEIGHT = _HEIGHT
      this.x = _x
      this.xVal = _xValue
      this.yVal = _yValue
      this.ylabel = _ylabel
      
  
      this.initVis()
    }
  
    initVis() {
      console.log('new line')
      const vis = this

    //   vis.g = vis.svg.append("g")
    //     .attr("transform", `translate(${vis.MARGIN.LEFT}, ${vis.MARGIN.TOP})`)

      vis.yAxisgroup = vis.g.append("g")
      .attr("class", "yaxis2")
      .attr("transform", `translate(${vis.WIDTH}, 0)`)
  
  
      vis.yLabel = vis.g.append("text")
        .attr("class", "title")
        .attr("y", vis.WIDTH+70)
        .attr("x", - (vis.HEIGHT / 2))
        .attr("font-size", "12px")
        .attr("text-anchor", "start")
  
      vis.y = d3.scaleLinear()
        .rangeRound([vis.HEIGHT, 0])

        vis.wrangleData()
  
    }
  
  
    wrangleData() {
    //   this.data = _data
      const vis = this
      
      // vis.value = $("#var-select").val()
      // vis.time = $("#var-time-select").val()
      
      vis.xAxis = Array.from(new Set(vis.data.map((d) => d[vis.xVal])))
      
      // vis.valuecheck = checkval(vis.value, vis.time)
      // vis.yAxis = vis.valuecheck[0]
      // vis.label = vis.valuecheck[1]
  
      vis.dataFiltered = createNest(vis.xAxis, vis.yAxis)
      
      vis.yLabel.text(vis.label)
      console.log(vis.label)
  
      vis.updateVis()
    }
  
    updateVis() {
      const vis = this
  
      vis.y.domain([0, d3.max(vis.yAxis)])
  
      vis.t = d3.transition().duration(1000)
  
      // axis labels
      vis.yAxisgroupCall = d3.axisRight(vis.y)
    //   .ticks(6)
      .tickFormat(d => lableCheck(d, vis.label))
      
      vis.yAxisgroup
      .transition(vis.t).call(vis.yAxisgroupCall)
      
  
      vis.g.selectAll("path.line").remove()

  
      // draw line
      vis.line = d3.line()
          .x(d => vis.x(d.key) + vis.x.bandwidth() / 2)
          .y(d=> vis.y(d.value))
    console.log(vis.dataFiltered)
    console.log(vis.line(vis.dataFiltered))
  
      vis.g.append("path")
          .attr("class", "line")
          .attr("fill", "none")
          .attr("stroke", "blue")
          .attr("stroke-width", "3px")
          .transition(vis.t)
          .attr("d", vis.line(vis.dataFiltered))
    }
  }
      