/*
*    line chart
*/
import { yrs , months, resalepriceavg} from main.js

console.log('linechart printing')

const MARGIN = { LEFT: 80, RIGHT: 100, TOP: 50, BOTTOM: 40 }
const WIDTH = 700 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 370 - MARGIN.TOP - MARGIN.BOTTOM
  
const svg = d3.select('#line-chart').append("svg")
        .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
        .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
  
        const g = svg.append("g")
        .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)
  
      // line chart
      const x = d3.scaleTime()
      .rangeRound([0, WIDTH])

      const y = d3.scaleLinear()
        .range([HEIGHT, 0])


    const yAxisCall = d3.axisLeft()
    const xAxisCall = d3.axisBottom()
        .ticks(4)
        
        const xAxisGroup = g.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${HEIGHT})`)
      
        const yAxisGroup = g.append("g")
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
        const Ylabel = g.append("text")
        .attr("class", "y axis-label")
        .attr("x", - (HEIGHT / 2))
        .attr("y", -60)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
  
      // const stack = d3.stack()
      //   .keys(["west", "south", "northeast", "midwest"])
  
      // const area = d3.area()
      //   .x(d => const x(parseTime(d.data.date)))
      //   .y0(d => const y(d[0]))
      //   .y1(d => const y(d[1]))
  
      // const addLegend()
  
    //   wrangleData()
    
  
  
    // wrangleData() {
  
      const variable = $("#var-select").val()
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
  
    //   updateVis()
    // }
  
    // updateVis() {

    // var years = window.yrs
    // var rpriceavg = window.resalepriceavg

    var years = yrs
    var rpriceavg = resalepriceavg



    console.log(years)
  
      const t = d3.transition().duration(750)
  
      const value = flag ? "remainingyrs" : "resale_price"
    
    
      x.domain(d3.extent(years))
      console.log(years)
      y.domain([d3.min(rpriceavg), 
                d3.max(rpriceavg)])
      
      AxisCall = d3.axisBottom(x)
      .tickValues(years)
      .tickFormat((y, i) => years[i])
      xAxisGroup.transition(t).call(xAxisCall)  
        .selectAll("text")
          .attr("y", "10")
          .attr("x", "-5")
          .attr("text-anchor", "end")
          .attr("transform", "rotate(-40)")
          
    
        yAxisCall = d3.axisLeft(y)
        .ticks(3)
        .tickFormat(d => "$"+d)
        yAxisGroup.transition(t).call(yAxisCall) 
    
      // // JOIN new data with old elements.
      // const rects = g.selectAll("line")
      //   // .data(data, d => d.year)
      //   .data(yrs) 
    
      // // EXIT old elements not present in new data.
      // rects.exit()
      //   .attr("fill", "red")
      //   .transition(t)
      //     .attr("cy", y(0))
      //     .remove()
    
      // // ENTER new elements present in new data...
      // rects.enter().append("circle")
      //   .attr("fill", "grey")
      //   .attr("cy", y(0))
      //   .attr("r", 5)
      //   // AND UPDATE old elements present in new data.
      //   .merge(rects)
      //   .transition(t)
      //     .attr("cx", (d) => x(d) + (x.bandwidth() / 2))
      //     .attr("cy", (d, i) => y(resalepriceavg[i]))
    
    
      // draw line
      const line = d3.line()
      .x(d => x(d))
      .y((d, i) => y(rpriceavg[i]))
    
      // add line to chart
      g.append("path")
      .datum(years)
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "grey")
      .attr("stroke-width", "3px")
      // .attr("d", line(yrs))
      .attr("d", line)
    
       const text = flag ? "Avg Revenue ($)" : "Profit ($)"
       this.Ylabel.text(text)
    // }
  
    addLegend() ;{
      const vis = this
  
      const legend = g.append("g")
        .attr("transform", "translate(50, -25)")
  
      const legendArray = [
        { label: "Northeast", color: color("northeast") },
        { label: "West", color: color("west") },
        { label: "South", color: color("south") },
        { label: "Midwest", color: color("midwest" )}
      ]
  
      const legendCol = legend.selectAll(".legendCol")
        .data(legendArray)
        .enter().append("g")
          .attr("class", "legendCol")
          .attr("transform", (d, i) => `translate(${i * 100}, 0)`)
          
      legendCol.append("rect")
        .attr("class", "legendRect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", d => d.color)
        .attr("fill-opacity", 0.5)
  
      legendCol.append("text")
        .attr("class", "legendText")
        .attr("x", 20)
        .attr("y", 10)
        .attr("text-anchor", "start")
        .text(d => d.label)
    }
