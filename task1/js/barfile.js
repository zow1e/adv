/*
*    bar chart
*/


function createbarchart(xaxis, yaxis) {

    console.log('barchart printing')
    
    MARGIN = { LEFT: 80, RIGHT: 100, TOP: 50, BOTTOM: 40 }
    WIDTH = 700 - MARGIN.LEFT - MARGIN.RIGHT
    HEIGHT = 370 - MARGIN.TOP - MARGIN.BOTTOM
      
    const svg = d3.select('#bar-chart').append("svg")
            .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
            .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
      
            g = svg.append("g")
            .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)
      
          // // line chart
          x = d3.scaleBand()
          .range([0, WIDTH])
        //   .range([MARGIN.LEFT, WIDTH - MARGIN.RIGHT])
          .padding(0.1);
    
          y = d3.scaleLinear()
            .range([HEIGHT, 0])

            
            xAxisGroup = g.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0, ${HEIGHT})`)
          
            yAxisGroup = g.append("g")
            .attr("class", "y axis")
      
    
            // X label
            g.append("text")
            .attr("class", "x axis-label")
            .attr("x", WIDTH / 2)
            .attr("y", HEIGHT + 60)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .text("Year")
    
            // Y label
            Ylabel = g.append("text")
            .attr("class", "y axis-label")
            .attr("x", - (HEIGHT / 2))
            .attr("y", -60)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
      

          // const addLegend()
      
          updatebar(xaxis, yaxis, 'Avg Resale Price ($)')
    
    }
      
      
    function updatebar(xaxis, yaxis, ylabel) {
    
        console.log('updating bar')
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

    
        x.domain(xaxis)

        y.domain([0, 
                d3.max(yaxis)])
        
        const xAxisCall = d3.axisBottom(x)
        .tickValues(xaxis)
        .tickFormat((d) => d)

        xAxisGroup
        .transition(t).call(xAxisCall)  
        .selectAll("text")
            .attr("y", "10")
            .attr("x", "-5")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-40)")
            
    
        yAxisCall = d3.axisLeft(y)
        .ticks(5)
        .tickFormat(d => "$"+d)
        yAxisGroup
        .transition(t)
        .call(yAxisCall) 

        // draw bars
        const rects = g.selectAll("rect")
        .data(xaxis)
    
    // delete gone bars
    rects.exit()
        .attr("class", "exit")
        .transition(t)
        .attr("height", 0)
        .attr("y", HEIGHT)
        .style("fill-opacity", "0.1")
        .remove()

        //update repeat bars
    rects
        .attr("class", "update")
        .transition(t)
        .attr("y", (d, i) => y(yaxis[i]))
        .attr("height", (d, i) => HEIGHT - y(yaxis[i]))
        .attr("x", d => x(d))
        .attr("width", x.bandwidth)

        //add new bars
    rects.enter().append("rect")
        .attr("class", "enter")
        .attr("y", (d, i) => y(yaxis[i]))
        .attr("height", (d, i) => HEIGHT - y(yaxis[i]))
        .attr("x", d => x(d))
        .attr("width", x.bandwidth)
        .attr("fill", "green")
    
    
        Ylabel.text(ylabel)
      
        // addLegend() {
        //   const vis = this
      
        //   const legend = g.append("g")
        //     .attr("transform", "translate(50, -25)")
      
        //   const legendArray = [
        //     { label: "Northeast", color: color("northeast") },
        //     { label: "West", color: color("west") },
        //     { label: "South", color: color("south") },
        //     { label: "Midwest", color: color("midwest" )}
        //   ]
      
        //   const legendCol = legend.selectAll(".legendCol")
        //     .data(legendArray)
        //     .enter().append("g")
        //       .attr("class", "legendCol")
        //       .attr("transform", (d, i) => `translate(${i * 100}, 0)`)
              
        //   legendCol.append("rect")
        //     .attr("class", "legendRect")
        //     .attr("width", 10)
        //     .attr("height", 10)
        //     .attr("fill", d => d.color)
        //     .attr("fill-opacity", 0.5)
      
        //   legendCol.append("text")
        //     .attr("class", "legendText")
        //     .attr("x", 20)
        //     .attr("y", 10)
        //     .attr("text-anchor", "start")
        //     .text(d => d.label)
        // };
    
      }
    