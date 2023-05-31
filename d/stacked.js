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
  
    updatestacked(data, 'Count')
    addLegend()
  
  }
        
        
  function updatestacked(data, ylabel) {
      
    console.log('updating stacked')
  
    // aggregate and simplify data

    const aggregatedData = d3.rollup(
      data,
      v => v.length,
      d => d.town,
      d => d.flat_type
    )
    // console.log(aggregatedData)
    
    // simplify
    const chartData = Array.from(aggregatedData, ([town, models]) => ({
      town, models: Array.from(models, ([model, count]) => ({ model, count })),
    }))
    
    // console.log(chartData[0].models[0].count)
    
    keys = Array.from(new Set(data.map((d) => d.flat_type)));
    
    const t = d3.transition().duration(600)
  
    kxScale.domain(chartData.map(d => d.town))
    // kyScale.domain([0, d3.max(chartData, d => d3.sum(keys, k => d[k]))])
    kyScale.domain([0, d3.max(chartData, d => d3.sum(d.models, (m) => m.count))])
    // colorScale.domain(keys)
    colorScale.domain(chartData[0].models.map((d) => d.model))

    
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
  
  
      // tooltip
      var tooltip = kg
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background", "#000")
        .text("a simple tooltip");
  
  // console.log(keys)
  // Create the stacked bars
  const barGroups = kg.selectAll('.bar-group')
  .selectAll('.bar-group')
  .data(
    d3.stack().keys(keys)(chartData.map((d) => d.models)),d => d.key
  )
  .join(
    (exit) =>
      exit
        .selectAll('rect')
        .data((d) => d, (data, i) => data.data.town + data.key + i)
        .join('rect')
        .attr('x', (d) => kxScale(d.data.town))
        .attr('y', HEIGHT)
        .attr('height', 0)
        .attr('width', kxScale.bandwidth())
        .attr('fill', (d) => colorScale(d.key))
        .call((exit) =>
          exit
            .transition(t)
            .duration(500)
            .attr('y', HEIGHT)
            .attr('height', 0)
            .remove()
        ),
    (update) =>
      update
        .selectAll('rect')
        .data((d) => d, (data, i) => data.data.town + data.key + i)
        .join('rect')
        .attr('x', (d) => kxScale(d.data.town))
        .attr('y', (d) => kyScale(d[1]))
        .attr('height', (d) => kyScale(d[0]) - kyScale(d[1]))
        .attr('width', kxScale.bandwidth()),
    (enter) =>
      enter
        .append('g')
        .attr('class', 'bar-group')
        .attr('fill', (d) => colorScale(d.key))
        .selectAll('rect')
        .data((d) => d, (data, i) => data.data.town + data.key + i)
        .join('rect')
        .attr('x', (d) => kxScale(d.data.town))
        .attr('y', (d) => kyScale(d[0]))
        .attr('height', (d) => kyScale(d[1]) - kyScale(d[0]))
        .attr('width', kxScale.bandwidth())
        .call((enter) =>
          enter
            .transition(t)
            .attr('y', (d) => kyScale(d[1]))
            .attr('height', (d) => kyScale(d[0]) - kyScale(d[1]))
        )
  )

  // console.log(chartData[0].models)

  // const bars = kg
  //       .selectAll('g')
  //       .data(chartData)
  //       .enter()
  //       .append('g')
  //       .attr('transform', (d) => `translate(${kxScale(d.town)},0)`)
  //       .selectAll('rect')
  //       .data((d) => d.models)
  //       .enter()
  //       .append('rect')
  //       .attr('x', (d) => kxScale.bandwidth() / 4)
  //       .attr('y', (d) => kyScale(d3.sum(d.models.slice(0, d.index), (m) => m.count)))
  //       .attr('width', kxScale.bandwidth() / 2)
  //       .attr('height', (d) => kyScale(d.count) - kyScale(0))
  //       .attr('fill', (d) => color(d.model));

      
      kYlabel.text(ylabel)  

      // addLegend()

        }

    function addLegend() {

        const flatModels = keys
            
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
      