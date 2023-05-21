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

        // Define the range of colors for the color scale
    // const colorRange = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"];
    const colorRange = d3.schemeCategory10

    // Create the color scale using d3.scaleOrdinal
    colorScale = d3.scaleOrdinal()
    .range(colorRange)
            
      
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
  
  }
        
        
  function updatestacked(data, ylabel) {
      
    console.log('updating stacked')
        // console.log(xaxis)
  
  
        // const dayNest = d3.nest()
        //   .key(d => formatTime(d.date))
        //   .entries(calls)
    
        // const dataFiltered = const dayNest
        //   .map(day => day.values.reduce(
        //     (accumulator, current) => {
        //         accumulator.date = day.key
        //         accumulator[current.team] = accumulator[current.team] + current[const variable]
        //         return accumulator
        //     }, {
        //       "northeast": 0,
        //       "midwest": 0,
        //       "south": 0,
        //       "west": 0
        //     }
        //   ))
    
    
    
    const t = d3.transition().duration(600)
  
    kxScale.domain(data.map(d => d.town))
    kyScale.domain([0, d3.max(data, d => d3.sum(d.counts, c => d3.sum(c.priceRangeCounts, pr => pr[1])))])

    
    // colorScale.domain(flatModels)
    
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
  
  
          // draw bars
    // const rects = kg.selectAll("rect")
    //   .data(xaxis)
      
    //   // delete gone bars
    //   rects.exit()
    //       .attr("class", "exit")
    //       .transition(t)
    //       .attr("height", 0)
    //       .attr("y", HEIGHT)
    //       .style("fill-opacity", "0.1")
    //       .remove()
  
        //update repeat bars
        const townBars = kg.selectAll(".town-bar")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "town-bar")
        .attr("transform", d => `translate(${kxScale(d.town)}, 0)`);
    
    townBars.selectAll("rect")
        .data(d => d.counts)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", d => kyScale(d3.sum(d.priceRangeCounts, pr => pr[1])))
        .attr("width", kxScale.bandwidth())
        .attr("height", d => kyScale(0) - kyScale(d3.sum(d.priceRangeCounts, pr => pr[1])))
        .attr("fill", (d, i) => colorScale(i));
  
          // .addEventListener("mouseover", function (actual, i) {
  
          // .on('click', function (actual, i) {
          //   d3.selectAll('.value')
          //     .attr('opacity', 0)
    
          //   d3.select(this)
          //     .transition()
          //     .duration(300)
          //     .attr('opacity', 0.6)
          //     .attr('x', (a) => x(a.language) - 5)
          //     .attr('width', xScale.bandwidth() + 10) })
  
        //   .on("mouseover", function(d){tooltip.text((d, i) => y(yaxis[i])); return tooltip.style("visibility", "visible");})
        // .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
        // .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
      
      
      kYlabel.text(ylabel)

      addLegend()

        }

    function addLegend() {

        const flatModels = ["Improved", "New Generation", "Executive", "Maisonette"]
            
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
      