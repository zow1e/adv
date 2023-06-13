/*
*    bar chart
*/


class PieChart {
    constructor(_parentElement, _firstdata) {
      this.parentElement = _parentElement
      this.firstdata = _firstdata
  
      this.initVis()
    }
  
    initVis() {
      const vis = this
    
    vis.MARGIN = { LEFT: 280, RIGHT: 150, TOP: 170 , BOTTOM: 100 }
    vis.WIDTH = 690 - vis.MARGIN.LEFT - vis.MARGIN.RIGHT
    vis.HEIGHT = 420 - vis.MARGIN.TOP - vis.MARGIN.BOTTOM
    vis.RADIUS = (Math.min(vis.WIDTH, vis.HEIGHT) / 2) + 25
        
    vis.svg = d3.select(vis.parentElement).append("svg")
        .attr("width", vis.WIDTH + vis.MARGIN.LEFT + vis.MARGIN.RIGHT)
        .attr("height", vis.HEIGHT + vis.MARGIN.TOP + vis.MARGIN.BOTTOM)
  
      vis.g = vis.svg.append("g")
        .attr("transform", `translate(${vis.MARGIN.LEFT}, ${vis.MARGIN.TOP})`)
  
      vis.pie = d3.pie()
        .padAngle(0.0)
        .sort(null)

      vis.arc = d3.arc()
        .innerRadius(0)
        .outerRadius(vis.RADIUS)  
  
      vis.g.append("text")
      .attr("y", -140)
      .attr("x", -130)
      .attr("font-size", "17px")
      .attr("text-anchor", "start")
      .text("Count of 'Improved' flats by flat type")

      vis.colorScale = d3.scaleOrdinal()
      .range(d3.schemeCategory10)
  
      vis.wrangleData(vis.firstdata)
    }
  
  
    wrangleData(_data) {
      const vis = this
      this.data = _data
  
      vis.town = $("#var-town-select").val()
      
      vis.rolledpie = d3.rollup(vis.data, v => d3.sum(v, d => d.flat_model == 'Improved'), d => d.flat_type)
      
      vis.piearr = []
      vis.townarray = [] // = flat type
    
      vis.rolledpie.forEach((d , i) => {
        vis.townarray.push(i)
        vis.piearr.push({
          'town': i,
          'count': d
        })
      })
  
      vis.updateVis()

    }
  
    updateVis() {
      const vis = this
  
      vis.t = d3.transition().duration(1000)

      vis.pie.value(d => d.count)
  
      vis.path =  vis.g.selectAll("path")
      .data(vis.pie(vis.piearr))

      vis.path.exit()
      .attr("class", "exit")
      .transition(vis.t)
        .style("fill-opacity", "0.1")
        .remove()

      vis.path.transition(vis.t)
      .attrTween('d', arcTween)
    
      vis.path.enter().append("path")
      .attr('fill', d => vis.colorScale(d.data.town))
      .attr('class', d => d.data.town)
      .transition(vis.t)
      .attr('d', vis.arc)
        .attrTween("d", arcTween)
    
      function arcTween(d) {
        const i = d3.interpolate(this._current, d)
        this._current = i(1)
        return (t) =>  vis.arc(i(t))
      }

        vis.addLegend()
    }

  addLegend() {
    const vis = this

    vis.g.selectAll('g.legend').remove()
        
    const legend = vis.g.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${vis.WIDTH-100}, ${vis.HEIGHT-260})`)
  
    vis.townarray.forEach((model, i) => {
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
      .text('value: ' + vis.pie(vis.piearr)[i].data.count)  
    })
  }
}
      