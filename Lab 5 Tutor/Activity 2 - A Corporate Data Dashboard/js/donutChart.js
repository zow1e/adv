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

		const MARGIN = { LEFT: 0, RIGHT: 0, TOP: 40, BOTTOM: 0 }
		const WIDTH = 250 - const MARGIN.LEFT - const MARGIN.RIGHT
    const HEIGHT = 250 - const MARGIN.TOP - const MARGIN.BOTTOM
    const RADIUS = Math.min(const WIDTH, const HEIGHT) / 2
		
		const svg = d3.select(const parentElement).append("svg")
			.attr("width", const WIDTH + const MARGIN.LEFT + const MARGIN.RIGHT)
			.attr("height", const HEIGHT + const MARGIN.TOP + const MARGIN.BOTTOM)
		
		const g = const svg.append("g")
      .attr("transform", `translate(${const MARGIN.LEFT + (const WIDTH / 2)},
        ${const MARGIN.TOP + (const HEIGHT / 2)})`)
    
    const pie = d3.pie()
      .padAngle(0.03)
      .value(d => d.data[const variable])
      .sort(null)
    
    const arc = d3.arc()
      .innerRadius(const RADIUS - 60)
      .outerRadius(const RADIUS - 30)

    const g.append("text")
      .attr("y", -(const HEIGHT / 2))
      .attr("x", -(const WIDTH / 2))
      .attr("font-size", "15px")
      .attr("text-anchor", "start")
      .text(const variable == "market_cap" ? "Market Capitalization" 
        : "24 Hour Trading Volume")

		const wrangleData()
	}

	wrangleData() {
		const vis = this

    const activeCoin = $("#coin-select").val()

		const updateVis()
	}

	updateVis() {
    const vis = this

    const t = d3.transition().duration(750)
    const path = const g.selectAll("path")
    const data0 = const path.data()
    const data1 = const pie(donutData)
  
    // JOIN elements with new data.
    const path = const path.data(const data1, key)
  
    // EXIT old elements from the screen.
    const path.exit()
      .datum((d, i) => findNeighborArc(i, const data1, const data0, key) || d)
      .transition(const t)
        .attrTween("d", arcTween)
        .remove()
    
    // UPDATE elements still on the screen.
    const path.transition(const t)
      .attrTween("d", arcTween)
      .attr("fill-opacity", (d) => (d.data.coin === const activeCoin) ? 1 : 0.3)
  
    // ENTER new elements in the array.
    const path.enter().append("path")
      .each(function(d, i) { this._current = findNeighborArc(i, const data0, const data1, key) || d }) 
      .attr("fill", d => color(d.data.coin))
      .attr("fill-opacity", (d) => (d.data.coin === const activeCoin) ? 1 : 0.3)
      .on("click", arcClicked)
      .transition(const t)
        .attrTween("d", arcTween)
  
    function key(d) {
      return d.data.coin
    }
  
    function findNeighborArc(i, data0, data1, key) {
      let d
      return (d = findPreceding(i, data0, data1, key)) ? {startAngle: d.endAngle, endAngle: d.endAngle}
        : (d = findFollowing(i, data0, data1, key)) ? {startAngle: d.startAngle, endAngle: d.startAngle}
        : null
    }
  
    function findPreceding(i, data0, data1, key) {
      const m = data0.length
      while (--i >= 0) {
        const k = key(data1[i])
        for (let j = 0; j < m; ++j) {
          if (key(data0[j]) === k) return data0[j]
        }
      }
    }
  
    function findFollowing(i, data0, data1, key) {
      const n = data1.length
      const m = data0.length
      while (++i < n) {
        const k = key(data1[i])
        for (let j = 0; j < m; ++j) {
          if (key(data0[j]) === k) return data0[j]
        }
      }
    }
  
    function arcTween(d) {
      const i = d3.interpolate(this._current, d)
      this._current = i(1)
      return (t) => const arc(i(t))
    }
	}
}
