/*
*    bar chart
*/


class LineChart {
  
  constructor(_parentElement, _firstdata) {
    this.parentElement = _parentElement
    this.firstdata = _firstdata

    this.initVis()
  }

  initVis() {
    console.log('new line')
    const vis = this
  
    vis.MARGIN = { LEFT: 80, RIGHT: 100, TOP: 50 , BOTTOM: 70 }
    vis.WIDTH = 700 - vis.MARGIN.LEFT - vis.MARGIN.RIGHT
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

    vis.x = d3.scaleTime().range([0, vis.WIDTH])

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

    // grid
    vis.gridline = fc.annotationSvgGridline()
    .xScale(vis.x)
    .yScale(vis.y);

    vis.g.append("g")
    .call(vis.gridline);

    vis.wrangleData(vis.firstdata)
    vis.addTooltip()
  }


  wrangleData(_data) {
    const vis = this
    this.data = _data

    console.log(vis.data)

    vis.value = $("#var-select").val()
    vis.time = $("#var-time-select").val()
    
    vis.xAxis = Array.from(new Set(vis.data.map((d) => d[vis.time])))
    
    vis.valuecheck = checkval(vis.value, vis.time)
    vis.yAxis = vis.valuecheck[0]
    vis.label = vis.valuecheck[1]

    vis.dataFiltered = createNest(vis.xAxis, vis.yAxis)
    vis.yLabel.text(vis.label)

    vis.updateVis()
  }

  updateVis() {
    const vis = this

    function changetostring(dateobj) {
      vis.obj = String(dateobj).length
      if (vis.obj == 4) {
        return dateobj }
      else if (vis.obj == 6) {
        const timeParse = d3.timeParse('%m/%Y')
        const formatTime = d3.timeFormat("%b %Y")
        return formatTime(timeParse(dateobj)) }
      else if (vis.obj == 2) {3
        const timeParse = d3.timeParse('%m')
        const formatTime = d3.timeFormat("%b")
        return formatTime(timeParse(dateobj)) }
    }

    vis.t = d3.transition().duration(1000)


    // update scales
    vis.x.domain(d3.extent(vis.dataFiltered, d=>d.key))
    vis.y.domain([0, d3.max(vis.dataFiltered, d => d.value)*1.05])

    // axis labels
    vis.yAxisgroupCall = d3.axisLeft(vis.y)
    .ticks(6)
    .tickFormat(d => lableCheck(d, vis.label))
    
    vis.yAxisgroup
    .transition(vis.t).call(vis.yAxisgroupCall)
    

    vis.xAxisgroupCall = d3.axisBottom(vis.x)
      .tickValues(vis.dataFiltered.map(d => d.key))
      .tickFormat(d => changetostring(d))
    vis.xAxisgroup
      .transition(vis.t)
      .call(vis.xAxisgroupCall)  
      .selectAll("text")
        .attr("y", "10")
        .attr("x", "-5")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-40)")

    vis.g.selectAll("path.line").remove()

    // draw line
    vis.line = d3.line()
        .x(d => vis.x(d.key))
        .y(d=> vis.y(d.value))
        

    vis.g.append("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", "3px")
        .transition(vis.t)
        .attr("d", vis.line(vis.dataFiltered))
  }

  addTooltip() {
    const vis = this

    const bisectDate = d3.bisector(d => d.key).left

    const focus = vis.g.append("g")
      .attr("class", "focus")
      .style("display", "none")
  
    focus.append("line")
      .attr("class", "x-hover-line hover-line")
      .attr("y1", 0)
      .attr("y2", vis.HEIGHT)
  
    focus.append("line")
      .attr("class", "y-hover-line hover-line")
      .attr("x1", 0)
      .attr("x2", vis.WIDTH)
  
    focus.append("circle")
      .attr("r", 7.5)
  
    focus.append("text")
      .attr("x", 15)
      .attr("dy", ".31em")
  
      vis.g.append("rect")
      .attr("class", "overlay")
      .attr("width", vis.WIDTH+50)
      .attr("height", vis.HEIGHT+50)
      .on("mouseover", () => focus.style("display", null))
      .on("mouseout", () => focus.style("display", "none"))
      .on("mousemove", mousemove)
      .on('click', mouseClick)
  
    function mouseClick() {
      console.log("mouseClick")
    }
  
    function mousemove(event) {
      const x0 = vis.x.invert(d3.pointer(event, this)[0])
      const i = bisectDate(vis.dataFiltered, x0, 1)
      const d0 = vis.dataFiltered[i - 1]
      const d1 = vis.dataFiltered[i]
      const d = x0 - d0.key > d1.key - x0 ? d1 : d0
      focus.attr("transform", `translate(${vis.x(d.key)}, ${vis.y(d.value)})`)
      focus.select("text").text(d.value)
      focus.select(".x-hover-line").attr("y2", vis.HEIGHT - vis.y(d.value))
      focus.select(".y-hover-line").attr("x2", -vis.x(d.key))
    }
  }
}
    