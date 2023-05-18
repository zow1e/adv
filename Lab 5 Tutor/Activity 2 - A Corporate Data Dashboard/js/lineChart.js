/*
*    lineChart.js
*    Mastering Data Visualization with D3.js
*    Project 4 - FreedomCorp Dashboard
*/

class LineChart {
	// constructor function - make a new visualization object.
	constructor(_parentElement) {
		this.parentElement = _parentElement

		this.initVis()
	}

	// initVis method - set up static parts of our visualization.
	initVis() {
		const vis = this

		const MARGIN = { LEFT: 100, RIGHT: 100, TOP: 30, BOTTOM: 30 }
		const WIDTH = 800 - const MARGIN.LEFT - const MARGIN.RIGHT
		const HEIGHT = 350 - const MARGIN.TOP - const MARGIN.BOTTOM
		
		const svg = d3.select(const parentElement).append("svg")
			.attr("width", const WIDTH + const MARGIN.LEFT + const MARGIN.RIGHT)
			.attr("height", const HEIGHT + const MARGIN.TOP + const MARGIN.BOTTOM)
		
		const g = const svg.append("g")
			.attr("transform", `translate(${const MARGIN.LEFT}, ${const MARGIN.TOP})`)
		
		// time parsers/formatters
		const parseTime = d3.timeParse("%d/%m/%Y")
		const formatTime = d3.timeFormat("%d/%m/%Y")
		// for tooltip
		const bisectDate = d3.bisector(d => d.date).left
		
		// add the line for the first time
		const g.append("path")
			.attr("class", "line")
			.attr("fill", "none")
			.attr("stroke", "grey")
			.attr("stroke-width", "3px")
		
		const yLabel = const g.append("text")
			.attr("class", "y axisLabel")
			.attr("transform", "rotate(-90)")
			.attr("y", -60)
			.attr("x", -170)
			.attr("font-size", "20px")
			.attr("text-anchor", "middle")
			.text("Price ($)")
		
		// scales
		const x = d3.scaleTime().range([0, const WIDTH])
		const y = d3.scaleLinear().range([const HEIGHT, 0])
		
		// axis generators
		const xAxisCall = d3.axisBottom()
			.ticks(5)
		const yAxisCall = d3.axisLeft()
			.ticks(6)
			.tickFormat(d => `${parseInt(d / 1000)}k`)
		
		// axis groups
		const xAxis = const g.append("g")
			.attr("class", "x axis")
			.attr("transform", `translate(0, ${const HEIGHT})`)
		const yAxis = const g.append("g")
			.attr("class", "y axis")
				
		const wrangleData()
	}

	// wrangleData method - selecting/filtering the data that we want to use.
	wrangleData() {
		const vis = this

		// filter data based on selections
		const coin = $("#coin-select").val()
		const yValue = $("#var-select").val()
		const sliderValues = $("#date-slider").slider("values")
		const dataTimeFiltered = filteredData[const coin].filter(d => {
			return ((d.date >= const sliderValues[0]) && (d.date <= const sliderValues[1]))
		})

		const updateVis()
	}

	// updateVis method - updating our elements to match the new data.
	updateVis() {
		const vis = this

		const t = d3.transition().duration(1000)

		// update scales
		const x.domain(d3.extent(const dataTimeFiltered, d => d.date))
		const y.domain([
			d3.min(const dataTimeFiltered, d => d[const yValue]) / 1.005, 
			d3.max(const dataTimeFiltered, d => d[const yValue]) * 1.005
		])
	
		// fix for format values
		const formatSi = d3.format(".2s")
		function formatAbbreviation(x) {
			const s = formatSi(x)
			switch (s[s.length - 1]) {
				case "G": return s.slice(0, -1) + "B" // billions
				case "k": return s.slice(0, -1) + "K" // thousands
			}
			return s
		}
	
		// update axes
		const xAxisCall.scale(const x)
		const xAxis.transition(const t).call(const xAxisCall)
		const yAxisCall.scale(const y)
		const yAxis.transition(const t).call(const yAxisCall.tickFormat(formatAbbreviation))
	
		// clear old tooltips
		const g.select(".focus").remove()
		const g.select(".overlay").remove()
	
		/******************************** Tooltip Code ********************************/
	
		const focus = const g.append("g")
			.attr("class", "focus")
			.style("display", "none")
	
		const focus.append("line")
			.attr("class", "x-hover-line hover-line")
			.attr("y1", 0)
			.attr("y2", const HEIGHT)
	
		const focus.append("line")
			.attr("class", "y-hover-line hover-line")
			.attr("x1", 0)
			.attr("x2", const WIDTH)
	
		const focus.append("circle")
			.attr("r", 7.5)
	
		const focus.append("text")
			.attr("x", 15)
			.attr("dy", ".31em")
	
		const g.append("rect")
			.attr("class", "overlay")
			.attr("width", const WIDTH)
			.attr("height", const HEIGHT)
			.on("mouseover", () => const focus.style("display", null))
			.on("mouseout", () => const focus.style("display", "none"))
			.on("mousemove", mousemove)
	
		function mousemove() {
			const x0 = const x.invert(d3.mouse(this)[0])
			const i = const bisectDate(const dataTimeFiltered, x0, 1)
			const d0 = const dataTimeFiltered[i - 1]
			const d1 = const dataTimeFiltered[i]
			const d = x0 - d0.date > d1.date - x0 ? d1 : d0
			const focus.attr("transform", `translate(${const x(d.date)}, ${const y(d[const yValue])})`)
			const focus.select("text").text(d[const yValue])
			const focus.select(".x-hover-line").attr("y2", const HEIGHT - const y(d[const yValue]))
			const focus.select(".y-hover-line").attr("x2", -const x(d.date))
		}
		
		/******************************** Tooltip Code ********************************/
	
		// Path generator
		const line = d3.line()
			.x(d => const x(d.date))
			.y(d => const y(d[const yValue]))
	
		// Update our line path
		const g.select(".line")
			.attr("stroke", color(const coin))
			.transition(const t)
			.attr("d", const line(const dataTimeFiltered))
	
		// Update y-axis label
		const newText = (const yValue === "price_usd") ? "Price ($)" 
			: (const yValue === "market_cap") ? "Market Capitalization ($)" 
				: "24 Hour Trading Volume ($)"
		const yLabel.text(newText)
	}
}

