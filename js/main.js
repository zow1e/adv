/*
*    main.js
*    Assignment 
*/

const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 }
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM

let flag = true

const svg = d3.select("#line-chart").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

// X label
g.append("text")
  .attr("class", "x axis-label")
  .attr("x", WIDTH / 2)
  .attr("y", HEIGHT + 60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Month")

// Y label
const yLabel = g.append("text")
  .attr("class", "y axis-label")
  .attr("x", - (HEIGHT / 2))
  .attr("y", -60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")

const x = d3.scaleBand()
  .range([0, WIDTH])
  .paddingInner(0.3)
  .paddingOuter(0.2)

const y = d3.scaleLinear()
  .range([HEIGHT, 0])

const xAxisGroup = g.append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${HEIGHT})`)

const yAxisGroup = g.append("g")
  .attr("class", "y axis")

d3.csv("data/hdb-resale-prices_2000-2023May.csv").then(data => {

    allyears = []
    

  data.forEach(d => {
    d.block = Number(d.block)
    d.floor_area_sqm = Number(d.floor_area_sqm)
    d.lease_commence_date = Number(d.lease_commence_date)
    d.resale_price = Number(d.resale_price)

    
    // var parsetime = d3.timeParse("%d-%b-%y")
    // data.Date = parsetime(new Date(data.Date))

    d.yearmonth = d.month
    d.year = d['month'].slice(0,4)
    d.month = d['month'].substring(5)

    d.remainingyrs = d.year - d.lease_commence_date

    allyears.push(d.year)

  })

  yrs = [...new Set(allyears)]

  function avg(data) {
    resalepriceavg = []

    for (let y = 0; y < yrs.length; y++) {
        yearlist = []

    for (let i = 0; i < data.length; i++) {
        if (data[i].year == yrs[y]){
            yearlist.push(data[i].resale_price)

        }
    
      }
      yearavg = yearlist.reduce((a, b) => a + b, 0) / yearlist.length
      resalepriceavg.push(yearavg)

    }
    return resalepriceavg
}

resalepriceavg = avg(data)

avgobject = {}
avgobject.year = yrs
avgobject.price = resalepriceavg

  

  d3.interval(() => {
    // flag = !flag
    // const newData = flag ? data : data.slice(1) 
    // update(newData) 
    update(data)
  }, 1000)

  
//   update(data)
})


function update(data) {
  const value = flag ? "remainingyrs" : "resale_price"
  const t = d3.transition().duration(750) 

  x.domain(yrs)
  y.domain([0, d3.max(data, d => d['resale_price'])])
  
  const xAxisCall = d3.axisBottom(x)
  xAxisGroup.transition(t).call(xAxisCall)  
    .selectAll("text")
      .attr("y", "10")
      .attr("x", "-5")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-40)")

  const yAxisCall = d3.axisLeft(y)
    .ticks(3)
    .tickFormat(d => "$"+d)
  yAxisGroup.transition(t).call(yAxisCall) 

  // JOIN new data with old elements.
  const rects = g.selectAll("circle")
    // .data(data, d => d.year)
    .data(yrs) 

  // EXIT old elements not present in new data.
  rects.exit()
    .attr("fill", "red")
    .transition(t)
      .attr("cy", y(0))
      .remove()

  // ENTER new elements present in new data...
  rects.enter().append("circle")
    .attr("fill", "grey")
    .attr("cy", y(0))
    .attr("r", 5)
    // AND UPDATE old elements present in new data.
    .merge(rects)
    .transition(t)
      .attr("cx", (d) => x(d) + (x.bandwidth() / 2))
      .attr("cy", (d, i) => y(resalepriceavg[i]))

  const text = flag ? "Profit ($)" : "Revenue ($)"
  yLabel.text(text)
}
