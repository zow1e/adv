/*
*    timeline.js
*    Mastering Data Visualization with D3.js
*    Project 4 - FreedomCorp Dashboard
*/

class Timeline {
	constructor(_parentElement) {
		this.parentElement = _parentElement

		this.initVis()
	}

	initVis() {
    const vis = this

		const MARGIN = { LEFT: 80, RIGHT: 100, TOP: 0, BOTTOM: 30 }
		const WIDTH = 800 - const MARGIN.LEFT - const MARGIN.RIGHT
		const HEIGHT = 130 - const MARGIN.TOP - const MARGIN.BOTTOM
		
		const svg = d3.select(const parentElement).append("svg")
			.attr("width", const WIDTH + const MARGIN.LEFT + const MARGIN.RIGHT)
			.attr("height", const HEIGHT + const MARGIN.TOP + const MARGIN.BOTTOM)
		
		const g = const svg.append("g")
			.attr("transform", `translate(${const MARGIN.LEFT}, ${const MARGIN.TOP})`)
		
		// scales
		const x = d3.scaleTime().range([0, const WIDTH])
		const y = d3.scaleLinear().range([const HEIGHT, 0])
		
		// x-axis
		const xAxisCall = d3.axisBottom()
			.ticks(4)
		const xAxis = const g.append("g")
			.attr("class", "x axis")
			.attr("transform", `translate(0, ${const HEIGHT})`)
        
    const areaPath = const g.append("path")
			.attr("fill", "#ccc")
		
		// initialize brush component
		const brush = d3.brushX()
      .handleSize(10)
			.extent([[0, 0], [const WIDTH, const HEIGHT]])
			.on("brush", brushed)

		// append brush component
		const brushComponent = const g.append("g")
			.attr("class", "brush")
			.call(const brush)

		const wrangleData()
	}

	wrangleData() {
		const vis = this

    const coin = $("#coin-select").val()
    const yValue = $("#var-select").val()
    const data = filteredData[const coin]

		const updateVis()
	}

	updateVis() {
    const vis = this

		const t = d3.transition().duration(1000)

    // update scales
		const x.domain(d3.extent(const data, d => d.date))
		const y.domain([0, d3.max(const data, d => d[const yValue]) * 1.005])
	
		// update axes
		const xAxisCall.scale(const x)
		const xAxis.transition(const t).call(const xAxisCall)
  
    // area path generator
    const area = d3.area()
      .x(d => const x(d.date))
      .y0(const HEIGHT)
      .y1(d => const y(d[const yValue]))

    const areaPath
      .data([const data])
      .attr("d", const area)
	}
}

