/*
*    stacked bar chart
*/


class StackedChart {
    constructor(_parentElement, _firstdata) {
      this.parentElement = _parentElement
      this.firstdata = _firstdata
  
      this.initVis()
    }
  
    initVis() {
      const vis = this
    
    vis.MARGIN = { LEFT: 80, RIGHT: 250, TOP: 30 , BOTTOM: 150 }
    vis.WIDTH = 800 - vis.MARGIN.LEFT - vis.MARGIN.RIGHT
    vis.HEIGHT = 400 - vis.MARGIN.TOP - vis.MARGIN.BOTTOM
        
    vis.svg = d3.select(vis.parentElement).append("svg")
        .attr("width", vis.WIDTH + vis.MARGIN.LEFT + vis.MARGIN.RIGHT)
        .attr("height", vis.HEIGHT + vis.MARGIN.TOP + vis.MARGIN.BOTTOM)
  
      vis.g = vis.svg.append("g")
        .attr("transform", `translate(${vis.MARGIN.LEFT}, ${vis.MARGIN.TOP})`)
  
  
      vis.x = d3.scaleBand()
        .domain(townsall)
        .range([0, vis.WIDTH])
        .padding(0.3)
  
      vis.y = d3.scaleLinear().range([vis.HEIGHT, 0])

    //   vis.yline = d3.scaleLinear().range([vis.HEIGHT, 0])

      vis.colorScale = d3.scaleOrdinal()
      .range(d3.schemeCategory10)

  
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
        .text('Count of Units')

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

    vis.liney = d3.scaleLinear()
      .rangeRound([vis.HEIGHT, 0])
  
      vis.wrangleData(vis.firstdata)
      vis.addLegend()
      
    }
  
  
wrangleData(_data) {
    const vis = this
    this.data = _data

    const value = $("#var-select").val()

    vis.valuecheck = checkval(value, 'town')
    vis.lineval = vis.valuecheck[0]
    vis.label = vis.valuecheck[1]

    vis.lineNest = createNest(townsall, vis.lineval)
    vis.lineyLabel.text(vis.label)

    // console.log(vis.lineNest)

    
    const datagroup = d3.group(vis.data, d => d.flat_type)
    const flatall = Array.from(datagroup.keys())
    // vis.colorScale.domain(vis.flatall)
    vis.keystype = Array.from(new Set(vis.data.map((d) => d.flat_type)))
    vis.colorScale.domain(vis.keystype)

    vis.x.domain(vis.data.map(d => d.town))

    function matrixData() {
        const rollups = d3
          .rollups(
            vis.data.filter(d => d.flat_type),
            v => {
              const o = {};
              flatall.forEach(p => (o[p] = 0));
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
    
      vis.dataFiltered = matrixData()

    vis.updateVis()
    }

  updateVis() {
    const vis = this

    vis.t = d3.transition().duration(1000)

    vis.stacked = d3.stack().keys(vis.keystype)
    vis.stackedData = vis.stacked(vis.dataFiltered)
    // console.log(vis.stackedData)

    vis.ymax = d3.max(vis.stackedData, d => {
        return d3.max(d, d => {
            return d[1]
        }) })

    // update scales
    vis.y.domain([0, vis.ymax])
    vis.liney.domain([0, d3.max(vis.lineval)])

    // update axes
    vis.yAxisgroupCall = d3.axisLeft(vis.y)
    // .ticks(6)
    // .tickFormat(d => lableCheck(d, vis.label))
    vis.yAxisgroup
    .transition(vis.t)
    .call(vis.yAxisgroupCall)
    

    vis.xAxisgroupCall = d3.axisBottom(vis.x)
        // .tickValues(vis.dataFiltered.map(d => d.key))
        // .tickFormat(d => d)
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
      .tickFormat(d => lableCheck(d, vis.label))
    vis.lineyAxisgroup
      .transition(vis.t)
      .call(vis.lineyAxisgroupCall)

    // add bars
    vis.rects = vis.g
        .append('g')
        .selectAll("rect")
        .data(vis.stackedData)
    vis.mbars = vis.rects
    .selectAll('rects')
    .data(d => d)

    vis.rects.selectAll('rects')
    .data(d => d).exit()
        .attr("class", "exit")
        .transition(vis.t)
        .attr("height", 0)
        .attr("y", vis.HEIGHT)
        .style("fill-opacity", "0.1")
        .remove()
      // vis.mbars.exit()
      //   .attr("class", "exit")
      //   .transition(vis.t)
      //   .attr("height", 0)
      //   .attr("y", vis.HEIGHT)
      //   .style("fill-opacity", "0.1")
      //   .remove()

    vis.rects
        .attr("class", "update")
        .selectAll("rect")
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data(d => d )
        .transition(vis.t)
        .attr("x", d =>  vis.x(d.data.town))
        .attr("y", d =>  vis.y(d[1]))
        .attr("height", d =>  vis.y(d[0]) - vis.y(d[1]))
        .attr("width",vis.x.bandwidth)

    vis.rects.enter().append("g")
    .attr("fill", d => vis.colorScale(d.key))
    // vis.mbars
    .selectAll("rect")
    // enter a second time = loop subgroup per subgroup to add all rectangles
    .data(d => d )
    .enter().append("rect")
      .attr("y", vis.y(0))
      .attr("x", d => vis.x(d.data.town))
      .attr("width", vis.x.bandwidth)
    // .transition(vis.t)
      .attr("y", d =>  vis.y(d[1]))
      .attr("height", d =>  vis.y(d[0]) - vis.y(d[1]))
      .attr("width",vis.x.bandwidth)

      // draw line
      vis.line = d3.line()
        .x(d => vis.x(d.key) + vis.x.bandwidth() / 2)
        .y(d=> vis.liney(d.value))

    // console.log(vis.lineNest)
    // console.log(vis.line(vis.lineNest))
  
    vis.g.selectAll("path.line").remove()
    
    vis.g.append("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", "3px")
        .transition(vis.t)
        .attr("d", vis.line(vis.lineNest))

    }

  addLegend() {
    const vis = this
        
    const legend = vis.g.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${vis.WIDTH+100}, ${vis.HEIGHT-200})`)
  
    vis.keystype.forEach((model, i) => {
        const legendrow = legend.append('g')
                .attr("transform", `translate(0, ${i * 20})`)
  
        legendrow.append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', vis.colorScale(model))
  
        legendrow.append('text')
        .attr('x', 20)
        .attr('y', 10)
        .style("text-transform", "capitalize")
        .attr("font-size", "13px")
        .text(model)
        
    })
  }
}
      