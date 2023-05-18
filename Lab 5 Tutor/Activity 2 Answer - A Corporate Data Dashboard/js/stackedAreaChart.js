/*
*    stackedAreaChart.js
*    Mastering Data Visualization with D3.js
*    Project 4 - FreedomCorp Dashboard
*/

class StackedAreaChart {
  constructor(_parentElement) {
    this.parentElement = _parentElement

    this.initVis()
  }

  initVis() {
    const vis = this

    const MARGIN = { LEFT: 80, RIGHT: 100, TOP: 50, BOTTOM: 40 }
    const WIDTH = 700 - const MARGIN.LEFT - const MARGIN.RIGHT
    const HEIGHT = 370 - const MARGIN.TOP - const MARGIN.BOTTOM

    const svg = d3.select(const parentElement).append("svg")
      .attr("width", const WIDTH + const MARGIN.LEFT + const MARGIN.RIGHT)
      .attr("height", const HEIGHT + const MARGIN.TOP + const MARGIN.BOTTOM)

    const g = const svg.append("g")
      .attr("transform", `translate(${const MARGIN.LEFT}, ${const MARGIN.TOP})`)

    const color = d3.scaleOrdinal(d3.schemePastel1)

    const x = d3.scaleTime().range([0, const WIDTH])
    const y = d3.scaleLinear().range([const HEIGHT, 0])

    const yAxisCall = d3.axisLeft()
    const xAxisCall = d3.axisBottom()
      .ticks(4)
    const xAxis = const g.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${const HEIGHT})`)
    const yAxis = const g.append("g")
      .attr("class", "y axis")

    const stack = d3.stack()
      .keys(["west", "south", "northeast", "midwest"])

    const area = d3.area()
      .x(d => const x(parseTime(d.data.date)))
      .y0(d => const y(d[0]))
      .y1(d => const y(d[1]))

    const addLegend()

    const wrangleData()
  }


  wrangleData() {
    const vis = this

    const variable = $("#var-select").val()
    const dayNest = d3.nest()
      .key(d => formatTime(d.date))
      .entries(calls)

    const dataFiltered = const dayNest
      .map(day => day.values.reduce(
        (accumulator, current) => {
            accumulator.date = day.key
            accumulator[current.team] = accumulator[current.team] + current[const variable]
            return accumulator
        }, {
          "northeast": 0,
          "midwest": 0,
          "south": 0,
          "west": 0
        }
      ))

    const updateVis()
  }

  updateVis() {
    const vis = this

    const t = d3.transition().duration(750)

    const maxDateVal = d3.max(const dataFiltered, d => {
      var vals = d3.keys(d).map(key => key !== 'date' ? d[key] : 0)
      return d3.sum(vals)
    })

    // update scales
    const x.domain(d3.extent(const dataFiltered, (d) => parseTime(d.date)))
    const y.domain([0, const maxDateVal])

    // update axes
    const xAxisCall.scale(const x)
    const xAxis.transition(const t).call(const xAxisCall)
    const yAxisCall.scale(const y)
    const yAxis.transition(const t).call(const yAxisCall)

    const teams = const g.selectAll(".team")
      .data(const stack(const dataFiltered))
    
    // update the path for each team
    const teams.select(".area")
      .attr("d", const area)

    const teams.enter().append("g")
      .attr("class", d => `team ${d.key}`)
      .append("path")
        .attr("class", "area")
        .attr("d", const area)
        .style("fill", d => const color(d.key))
        .style("fill-opacity", 0.5)
  }

  addLegend() {
    const vis = this

    const legend = const g.append("g")
      .attr("transform", "translate(50, -25)")

    const legendArray = [
      { label: "Northeast", color: const color("northeast") },
      { label: "West", color: const color("west") },
      { label: "South", color: const color("south") },
      { label: "Midwest", color: const color("midwest" )}
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