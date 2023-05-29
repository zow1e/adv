/*
*    bar chart
*/


function createstacked(data) {

    console.log('stacked printing')
    
    MARGIN = { LEFT: 80, RIGHT: 100, TOP: 50 , BOTTOM: 150 }
    WIDTH = 700 - MARGIN.LEFT - MARGIN.RIGHT
    HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM
        
    const svg = d3.select('#stacked').append("svg")
      .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
      .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
        
    kg = svg.append("g")
      .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)
        
    kxScale = d3.scaleBand()
      .range([0, WIDTH])
      .padding(0.1);
    
    kyScale = d3.scaleLinear()
      .range([HEIGHT, 0]);
  
              
    kxAxisGroup = kg.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${HEIGHT})`)
  
    kyAxisGroup = kg.append("g")
      .attr("class", "y axis")

    colorScale = d3.scaleOrdinal()
    .range(d3.schemeCategory10)
            
      
    // X label
    kg.append("text")
      .attr("class", "x axis-label")
      .attr("x", WIDTH / 2)
      .attr("y", HEIGHT + 60)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
  
    // Y label
    kYlabel = kg.append("text")
      .attr("class", "y axis-label")
      .attr("x", - (HEIGHT / 2))
      .attr("y", -60)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
  
      wrangleStacked(data)
    addLegend()
  
  }

  function wrangleStacked(data) {

    keystype = Array.from(new Set(data.map((d) => d.flat_type)))
    colorScale.domain(keystype)

    townflatg = d3.rollup(data, v => v.length, d => d.town, d => d.flat_type)
    flattown = d3.flatRollup(data, v => v.length, d => d.town, d => d.flat_type)
    let stackData = Array.from(townflatg, ([key, value]) => ({key, value}))
    kxScale.domain(data.map(d => d.town))

    console.log(flattypeall)


    dd = []
    flattown.forEach(d => {
      dd.push( {
        'town': d[0],
        [d[1]] : d[2]
      })
    })
    console.log(dd)
    // merge flat type with towns

    nn = [dd[0]]
    console.log(nn.length)

    for (let i = 0; i < dd.length; i++) {
      for (let r = 1; r < dd.length; r++) {
        if (dd[i].town == dd[r].town){
        nn.push({...dd[i], ...dd[r]})
      
        for (let n = 0; n < nn.length; n++) {
        //   if (dd[r] == nn[n]){
        //     break
          // }
          if (dd[r].town == nn[n].town){
            nn.push({...nn[n], ...dd[r]})
            // break
          }
        }
        }
      }
    }
    console.log(nn)
    console.log({...dd[0], ...dd[1]})

    updatestacked(stackData, 'Count')

  }
        
        
function updatestacked(stackD, ylabel) {
      
    console.log('updating stacked')

    // const xaxis = Array.from(new Set(data.map((d) => d.town)))
    
    const t = d3.transition().duration(600)

    
    // kyScale.domain([0, d3.max(chartData, d => d3.sum(keys, k => d[k]))])
    kyScale.domain([0, d3.max(stackD, d => d[1])])
    // colorScale.domain(keys)
    

    const xAxisCall = d3.axisBottom(kxScale)  

    kxAxisGroup
    .transition(t).call(xAxisCall)  
    .selectAll("text")
        .attr("y", "10")
        .attr("x", "-5")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-40)")
    
    const yAxisCall = d3.axisLeft(kyScale)
    .ticks(5)
    //   .tickFormat(d => d)
    kyAxisGroup
    .transition(t)
    .call(yAxisCall) 

    console.log(stackD[0].key)

    const stacked = d3.stack().keys(keystype)
    const stackedData = stacked(townflatg)
    console.log(stackedData)

        // Show the bars
    kg.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .join("g")
        .attr("fill", d => colorScale(d.key))
        .selectAll("rect")
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data(d => d)
        .join("rect")
        .attr("x", d => x(d.data.town))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width",x.bandwidth())

      
      kYlabel.text(ylabel)  

      // addLegend()

        }

    function addLegend() {

        const flatModels = keystype
            
        const legend = kg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${10}, ${HEIGHT-200})`)

        flatModels.forEach((model, i) => {
            legendrow = legend.append('g')
                    .attr("transform", `translate(0, ${i * 20})`)

            legendrow.append('rect')
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', colorScale(model))

            legendrow.append('text')
            .attr('x', 20)
            .attr('y', 10)
            .style("text-transform", "capitalize")
            .text(model)
           
        })
            }
      