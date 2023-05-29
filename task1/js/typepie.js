/*
*    donutChart.js
*    Mastering Data Visualization with D3.js
*    Project 4 - FreedomCorp Dashboard
*/

function createtypepie(data) {

    console.log('type pie printing')
    
    MARGIN = { LEFT: 270, RIGHT: 60, TOP: 180 , BOTTOM: 100 }
    pWIDTH = 700 - MARGIN.LEFT - MARGIN.RIGHT
    pHEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM
    RADIUS = (Math.min(pWIDTH, pHEIGHT) / 2) + 50
        
    const svg = d3.select('#pie-type').append("svg")
      .attr("width", pWIDTH + MARGIN.LEFT + MARGIN.RIGHT)
      .attr("height", pHEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
        
    tg = svg.append("g")
      .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)
    
    pie = d3.pie()
      .padAngle(0.0)
      .sort(null)
    
    arc = d3.arc()
      .innerRadius(0)
      .outerRadius(RADIUS)

    tg.append("text")
      .attr("y", -120)
      .attr("x", -250)
      .attr("font-size", "19px")
      .attr("text-anchor", "start")
      .text("Count of Flat Models")

    pcolorScale = d3.scaleOrdinal()
    .range(d3.schemeCategory10)

		wrangleData(data)
	}

	function wrangleData(data) {

    
    rolledpie = d3.rollup(data, v => v.length, d => d.flat_type)

    // console.log(rolledpie)

    piearr = []
    townarray = []

    rolledpie.forEach((d , i) => {
      townarray.push(i)
      piearr.push({
        'town': i,
        'count': d
      })
    })

    // console.log(piearr)

    updatetypepie()
	}

    function updatetypepie() {
      console.log('update pie')

      pie.value(d => d.count)
      // console.log(pie(piearr))

     const t = d3.transition().duration(750)

     const path =  tg.selectAll("path")
      .data( pie( piearr))
    
    //  path.transition( t)
    //   .attrTween("d", arcTween)
  
     path.enter().append("path")
     .attr('fill', d => pcolorScale(d.data.town))
     .attr("stroke", "black")
     .style("stroke-width", "1px")
    //  .style("opacity", 0.7)
      .transition( t)
      .attr('d', arc)
        // .attrTween("d", arcTween)
  
    // function arcTween(d) {
    //   const i = d3.interpolate(this._current, d)
    //   this._current = i(1)
    //   return (t) =>  arc(i(t))
    // }

    addpieLegend()
  }

  function addpieLegend() {

    const flatModels = townarray
            
        const legend = tg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${pWIDTH-200}, ${pHEIGHT-200})`)

        flatModels.forEach((model, i) => {
            legendrow = legend.append('g')
                    .attr("transform", `translate(0, ${i * 20})`)

            legendrow.append('rect')
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', pcolorScale(model))

            legendrow.append('text')
            .attr('x', 20)
            .attr('y', 10)
            .style("text-transform", "capitalize")
            .text(model)
           
        })
  }

