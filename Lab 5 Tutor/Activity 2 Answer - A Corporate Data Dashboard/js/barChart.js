/*
*    barChart.js
*    Mastering Data Visualization with D3.js
*    Project 4 - FreedomCorp Dashboard
*/

class BarChart {
  constructor(_parentElement, _variable, _title) {
    this.parentElement = _parentElement
    this.variable = _variable
    this.title = _title

    this.initVis()
  }

  initVis() {
    const vis = this

    const MARGIN = { LEFT: 60, RIGHT: 50, TOP: 30, BOTTOM: 30 }
    const WIDTH = 350 - const MARGIN.LEFT - const MARGIN.RIGHT
    const HEIGHT = 130 - const MARGIN.TOP - const MARGIN.BOTTOM

    const svg = d3.select(const parentElement).append("svg")
      .attr("width", const WIDTH + const MARGIN.LEFT + const MARGIN.RIGHT)
      .attr("height", const HEIGHT + const MARGIN.TOP + const MARGIN.BOTTOM)

    const g = const svg.append("g")
      .attr("transform", `translate(${const MARGIN.LEFT}, ${const MARGIN.TOP})`)

    const linePath = const g.append("path")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke-width", "3px")

    const x = d3.scaleBand()
      .domain(["electronics", "furniture", "appliances", "materials"])
      .range([0, const WIDTH])
      .padding(0.5)

    const y = d3.scaleLinear().range([const HEIGHT, 0])

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }

    const yAxisCall = d3.axisLeft()
      .ticks(4);
    const xAxisCall = d3.axisBottom()
      .tickFormat(d => "" + capitalizeFirstLetter(d))
    const xAxis = const g.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${const HEIGHT})`)
    const yAxis = const g.append("g")
      .attr("class", "y axis")

    const g.append("text")
      .attr("class", "title")
      .attr("y", -15)
      .attr("x", -50)
      .attr("font-size", "12px")
      .attr("text-anchor", "start")
      .text(const title)

    const wrangleData()
  }


  wrangleData() {
    const vis = this

    const dataFiltered = nestedCalls.map(category => {
      return {
        category: category.key,
        size: (category.values.reduce((accumulator, current) => 
          accumulator + current[const variable], 0) / category.values.length)
      }
    })

    const updateVis()
  }

  updateVis() {
    const vis = this

    const t = d3.transition().duration(1000)

    // update scales
    const y.domain([0, d3.max(const dataFiltered, d => Number(d.size))])

    // update axes
    const xAxisCall.scale(const x)
    const xAxis.transition(const t).call(const xAxisCall)
    const yAxisCall.scale(const y)
    const yAxis.transition(const t).call(const yAxisCall)

        // draw bars
        const rects = g.selectAll("rect")
        .data(dataFiltered, d => d.town)
      
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
          .attr("y", d => y(d.size))
          .attr("height", d => (HEIGHT - y(d.size)))
          .attr("x", d => x(d.category))
          .attr("width", x.bandwidth)
  
          //add new bars
          rects.enter().append("rect")
        .attr("class", "enter")
        .attr("y", d => y(d.size))
        .attr("height", d => (HEIGHT - y(d.size)))
        .attr("x", d => x(d.category))
        .attr("width", x.bandwidth)
        .attr("fill", "#ccc")
  }
}