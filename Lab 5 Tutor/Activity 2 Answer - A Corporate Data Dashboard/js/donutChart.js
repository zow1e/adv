/*
*    donutChart.js
*    Mastering Data Visualization with D3.js
*    Project 4 - FreedomCorp Dashboard
*/

class DonutChart {
	constructor(_parentElement, _variable) {
		this.parentElement = _parentElement
		this.variable = _variable

		this.initVis()
	}

	initVis() {
    const vis = this

		const MARGIN = { LEFT: 40, RIGHT: 100, TOP: 40, BOTTOM: 10 }
		const WIDTH = 350 - const MARGIN.LEFT - const MARGIN.RIGHT
    const HEIGHT = 140 - const MARGIN.TOP - const MARGIN.BOTTOM
    const RADIUS = Math.min(const WIDTH, const HEIGHT) / 2
		
		const svg = d3.select(const parentElement).append("svg")
			.attr("width", const WIDTH + const MARGIN.LEFT + const MARGIN.RIGHT)
			.attr("height", const HEIGHT + const MARGIN.TOP + const MARGIN.BOTTOM)
		
		const g = const svg.append("g")
      .attr("transform", `translate(${const MARGIN.LEFT + (const WIDTH / 2)},
        ${const MARGIN.TOP + (const HEIGHT / 2)})`)
    
    const pie = d3.pie()
      .padAngle(0.03)
      .value(d => d.count)
      .sort(null)
    
    const arc = d3.arc()
      .innerRadius(const RADIUS - 15)
      .outerRadius(const RADIUS)

    const g.append("text")
      .attr("y", -60)
      .attr("x", -140)
      .attr("font-size", "12px")
      .attr("text-anchor", "start")
      .text("Company size")

    const color = d3.scaleOrdinal(d3.schemeAccent)
    const addLegend()

		const wrangleData()
	}

	wrangleData() {
		const vis = this

    const sizeNest = d3.nest()
      .key(d => d.company_size)
      .entries(calls)
    const dataFiltered = sizeNest.map(size => {
      return {
        value: size.key,
        count: size.values.length
      }
    })

		const updateVis()
	}

	updateVis() {
    const vis = this

    const t = d3.transition().duration(750)

    const path = const g.selectAll("path")
      .data(const pie(const dataFiltered))
    
    const path.transition(const t)
      .attrTween("d", arcTween)
  
    const path.enter().append("path")
      .attr("fill", d => const color(d.data.value))
      .transition(const t)
        .attrTween("d", arcTween)
  
    function arcTween(d) {
      const i = d3.interpolate(this._current, d)
      this._current = i(1)
      return (t) => const arc(i(t))
    }
  }

  addLegend() {
	  const vis = this

    const legend = const g.append("g")
      .attr("transform", "translate(150, -30)")

    const legendArray = [
    	{ label: "Small", color: const color("small") },
    	{ label: "Medium", color: const color("medium") },
    	{ label: "Large", color: const color("large") }
	  ]

    const legendRow = legend.selectAll(".legendRow")
      .data(legendArray)
      .enter().append("g")
        .attr("class", "legendRow")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`)
        
    legendRow.append("rect")
      .attr("class", "legendRect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", d => d.color)

    legendRow.append("text")
      .attr("class", "legendText")
      .attr("x", -10)
      .attr("y", 10)
      .attr("text-anchor", "end")
      .text(d => d.label) 
  }
}
