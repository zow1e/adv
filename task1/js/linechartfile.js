/*
*    line chart
*/

class LINECHART {
  
    constructor(_parentElement) {
      this.parentElement = _parentElement
  
      this.initVis()
    }
  
    initVis() {
      const vis = this
  
      vis.MARGIN = { LEFT: 80, RIGHT: 100, TOP: 50, BOTTOM: 40 }
      vis.WIDTH = 700 - vis.MARGIN.LEFT - vis.MARGIN.RIGHT
      vis.HEIGHT = 370 - vis.MARGIN.TOP - vis.MARGIN.BOTTOM
  
      vis.svg = d3.select(vis.parentElement).append("svg")
        .attr("width", vis.WIDTH + vis.MARGIN.LEFT + vis.MARGIN.RIGHT)
        .attr("height", vis.HEIGHT + vis.MARGIN.TOP + vis.MARGIN.BOTTOM)
  
      vis.g = vis.svg.append("g")
        .attr("transform", `translate(${vis.MARGIN.LEFT}, ${vis.MARGIN.TOP})`)
  
      // line chart
      vis.x = d3.scaleTime()
      .rangeRound([0, WIDTH])

      vis.y = d3.scaleLinear()
        .range([HEIGHT, 0])


      vis.yAxisCall = d3.axisLeft()
      vis.xAxisCall = d3.axisBottom()
        .ticks(4)
        
      vis.xAxisGroup = vis.g.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${HEIGHT})`)
      
        vis.yAxisGroup = vis.g.append("g")
        .attr("class", "y axis")

        // X label
        vis.g.append("text")
        .attr("class", "x axis-label")
        .attr("x", WIDTH / 2)
        .attr("y", HEIGHT + 60)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("Year")

        // Y label
        vis.Ylabel = vis.g.append("text")
        .attr("class", "y axis-label")
        .attr("x", - (HEIGHT / 2))
        .attr("y", -60)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
  
      // vis.stack = d3.stack()
      //   .keys(["west", "south", "northeast", "midwest"])
  
      // vis.area = d3.area()
      //   .x(d => vis.x(parseTime(d.data.date)))
      //   .y0(d => vis.y(d[0]))
      //   .y1(d => vis.y(d[1]))
  
      // vis.addLegend()
  
      vis.wrangleData()
    }
  
  
    wrangleData() {
      const vis = this
  
      vis.variable = $("#var-select").val()
      // vis.dayNest = d3.nest()
      //   .key(d => formatTime(d.date))
      //   .entries(calls)
  
      // vis.dataFiltered = vis.dayNest
      //   .map(day => day.values.reduce(
      //     (accumulator, current) => {
      //         accumulator.date = day.key
      //         accumulator[current.team] = accumulator[current.team] + current[vis.variable]
      //         return accumulator
      //     }, {
      //       "northeast": 0,
      //       "midwest": 0,
      //       "south": 0,
      //       "west": 0
      //     }
      //   ))
  
      vis.updateVis()
    }
  
    updateVis() {
      const vis = this
  
      vis.t = d3.transition().duration(750)
  
      const value = flag ? "remainingyrs" : "resale_price"
    
    
      vis.x.domain(d3.extent(yrs))
      console.log(yrs)
      vis.y.domain([d3.min(resalepriceavg), 
                d3.max(resalepriceavg)])
      
      vis.xAxisCall = d3.axisBottom(x)
      .tickValues(yrs)
      .tickFormat((y, i) => yrs[i])
      vis.xAxisGroup.transition(t).call(xAxisCall)  
        .selectAll("text")
          .attr("y", "10")
          .attr("x", "-5")
          .attr("text-anchor", "end")
          .attr("transform", "rotate(-40)")
          
    
          vis.yAxisCall = d3.axisLeft(y)
        .ticks(3)
        .tickFormat(d => "$"+d)
        vis.yAxisGroup.transition(t).call(yAxisCall) 
    
      // // JOIN new data with old elements.
      // const rects = g.selectAll("line")
      //   // .data(data, d => d.year)
      //   .data(yrs) 
    
      // // EXIT old elements not present in new data.
      // rects.exit()
      //   .attr("fill", "red")
      //   .transition(t)
      //     .attr("cy", y(0))
      //     .remove()
    
      // // ENTER new elements present in new data...
      // rects.enter().append("circle")
      //   .attr("fill", "grey")
      //   .attr("cy", y(0))
      //   .attr("r", 5)
      //   // AND UPDATE old elements present in new data.
      //   .merge(rects)
      //   .transition(t)
      //     .attr("cx", (d) => x(d) + (x.bandwidth() / 2))
      //     .attr("cy", (d, i) => y(resalepriceavg[i]))
    
    
      // draw line
      vis.line = d3.line()
      .x(d => x(d))
      .y((d, i) => y(resalepriceavg[i]))
    
      // add line to chart
      g.append("path")
      .datum(yrs)
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "grey")
      .attr("stroke-width", "3px")
      // .attr("d", line(yrs))
      .attr("d", line)
    
       vis.text = flag ? "Avg Revenue ($)" : "Profit ($)"
       this.Ylabel.text(text)
    }
  
    addLegend() {
      const vis = this
  
      const legend = vis.g.append("g")
        .attr("transform", "translate(50, -25)")
  
      const legendArray = [
        { label: "Northeast", color: vis.color("northeast") },
        { label: "West", color: vis.color("west") },
        { label: "South", color: vis.color("south") },
        { label: "Midwest", color: vis.color("midwest" )}
      ]
  
      const legendCol = legend.selectAll(".legendCol")
        .data(legendArray)
        .enter().append("g")
          .attr("class", "legendCol")
          .attr("transform", (d, i) => `translate(${i * 100}, 0)`)
          
      legendCol.append("rect")
        .attr("class", "legendRect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", d => d.color)
        .attr("fill-opacity", 0.5)
  
      legendCol.append("text")
        .attr("class", "legendText")
        .attr("x", 20)
        .attr("y", 10)
        .attr("text-anchor", "start")
        .text(d => d.label)
    }
}