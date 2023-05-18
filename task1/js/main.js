/*
*    main.js
*    Assignment 
*/

const parseTime = d3.timeParse("%Y-%m")
const formatTime = d3.timeFormat("%d/%m/%Y")
// const formatYr = d3.timeFormat("%Y")
// const formatMonth = d3.timeFormat("%m")

// const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 }
// const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
// const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM

let flag = true

let lineline

// const svg = d3.select("#line-chart").append("svg")
//   .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
//   .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

// const g = svg.append("g")
//   .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

// // X label
// g.append("text")
//   .attr("class", "x axis-label")
//   .attr("x", WIDTH / 2)
//   .attr("y", HEIGHT + 60)
//   .attr("font-size", "20px")
//   .attr("text-anchor", "middle")
//   .text("Month")

// // Y label
// const yLabel = g.append("text")
//   .attr("class", "y axis-label")
//   .attr("x", - (HEIGHT / 2))
//   .attr("y", -60)
//   .attr("font-size", "20px")
//   .attr("text-anchor", "middle")
//   .attr("transform", "rotate(-90)")

// const x = d3.scaleBand()
//   .range([0, WIDTH])
//   .paddingInner(0.3)
//   .paddingOuter(0.2)



// const xAxisGroup = g.append("g")
//   .attr("class", "x axis")
//   .attr("transform", `translate(0, ${HEIGHT})`)

// const yAxisGroup = g.append("g")
//   .attr("class", "y axis")

d3.csv("data/hdb-resale-prices_2000-2023May.csv").then(data => {
  // d3.csv("data/small.csv").then(data => {

    var allyears = []
    var allmonths = []
    

  data.forEach(d => {
    d.block = Number(d.block)
    d.floor_area_sqm = Number(d.floor_area_sqm)
    d.lease_commence_date = Number(d.lease_commence_date)
    d.resale_price = Number(d.resale_price)

    
    
    d.date = formatTime(parseTime(d.month))
    d.year = parseTime(d.month).getFullYear()
    d.month = parseTime(d.month).getMonth()
    // console.log(d.year)
    // d.year = d['month'].slice(0,4)
    // d.month = d['month'].substring(5)

    d.remainingyrs = d.year - d.lease_commence_date

    allyears.push(d.year)
    allmonths.push(d.month)

    

  })

  // lineline = new LINECHART('#line-chart')


  

  // dates (year/month), measure (resale_price / floor_area_sqm etc)
  function avg(data, dates, timecol, measurecol) {
    measureavg = []

    for (let y = 0; y < dates.length; y++) {
        durationlist = []

    for (let i = 0; i < data.length; i++) {
        if (data[i][timecol] == yrs[y]){
          durationlist.push(data[i][measurecol])

        }
    
      }
      value = durationlist.reduce((a, b) => a + b, 0) / durationlist.length
      measureavg.push(value)

    }
    return measureavg
  
}

const yrs = [...new Set(allyears)]
const months = [...new Set(allmonths)]

const resalepriceavg = avg(data, yrs, 'year', 'resale_price')



// global.yrs = [...new Set(allyears)]
// global.months = [...new Set(allmonths)]

// global.resalepriceavg = avg(data, yrs, 'year', 'resale_price')


// var yrs = [...new Set(allyears)]
// var months = [...new Set(allmonths)]

// var resalepriceavg = avg(data, yrs, 'year', 'resale_price')

avgobject = {}
avgobject.year = yrs
avgobject.price = resalepriceavg

$("#var-select").on("change", () => {
  stackedArea.wrangleData()
  timeline.wrangleData()
})

  d3.interval(() => {
    // flag = !flag
    // const newData = flag ? data : data.slice(1) 
    // update(newData) 
    update(data)
  }, 1000)

  
//   update(data)
})

// lineline.wrangleData()


function update(data) {
 
}

console.log('main done')

export { yrs , months, resalepriceavg};