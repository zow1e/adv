/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Lab 4 Part 1 - Looping with Intervals
*/

const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 130 }
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM

const svg = d3.select("#chart-area1").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

// X label
g.append("text")
  .attr("class", "x axis-label")
  .attr("x", WIDTH / 2)
  .attr("y", HEIGHT + 50)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Month")

// Y label
g.append("text")
  .attr("class", "y axis-label")
  .attr("x", - (HEIGHT / 2))
  .attr("y", -60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Revenue ($)")


  

  d3.csv("data/small.csv").then(data => {

    console.log(data.length)
    allyears = []

    data.forEach(d => {
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


    //   d.yrprice = [d.year, d.resale_price]
  })


  yrs = [...new Set(allyears)]
//   console.log(data.map(d => d.year))

  

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

// console.log(pivot(data))

avgobject = {}
avgobject.year = yrs
avgobject.price = avg(data)

resalepriceavg = avg(data)
console.log(resalepriceavg)

// for (let i = 0; i < yrs.length; i++) {
//     avgobject[i].year = yrs[i]
//     avgobject[i].price = avg(data)[i]
// }


  const x = d3.scaleBand()
    .domain(yrs)
    .range([0, WIDTH])
    .paddingInner(0.3)
    .paddingOuter(0.2)
  
  const y = d3.scaleLinear()
    .domain([0, d3.max(resalepriceavg)])
    .range([HEIGHT, 0])

  const xAxisCall = d3.axisBottom(x)
  g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${HEIGHT})`)
    .call(xAxisCall)
    .selectAll("text")
      .attr("y", "10")
      .attr("x", "-5")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-40)")

  const yAxisCall = d3.axisLeft(y)
    .ticks(3)
    .tickFormat(d => '$' + d )
  g.append("g")
    .attr("class", "y axis")
    .call(yAxisCall)

  const rects = g.selectAll("rect")
    .data(yrs)
//   console.log(y(resalepriceavg[0]))
  rects.enter().append("rect")
    .attr("y", (d, i) => y(resalepriceavg[i]))
    .attr("x", d => x(d))
    .attr("width", x.bandwidth)
    .attr("height", (d, i) => HEIGHT - y(resalepriceavg[i]))
    .attr("fill", "grey")
 

    // interval

    // d3.interval(() => {
    //   // what will happen every 500 milliseconds
    //   console.log('update')

    //   // use this function to update the data
    //   // dynamic visual that runs every time data changes

    // }, 500 ) // milliseconds of pause
})