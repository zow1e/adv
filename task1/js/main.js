/*
*    main.js
*    Assignment 
*/

const parseTime = d3.timeParse("%Y-%m")
const formatTime = d3.timeFormat("%m-%Y")
const formatMonth = d3.timeFormat("%m")

monthNames = [ "January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December" ];


// import chart files
let lineline
let barfile


// d3.csv("data/hdb-resale-prices_2000-2023May.csv").then(data => {
d3.csv("data/small.csv").then(data => {

    var allyears = []
    var allmonths = []
    var alldates = []

    var alltowns = []
    

  data.forEach(d => {
    d.block = Number(d.block)
    d.floor_area_sqm = Number(d.floor_area_sqm)
    d.lease_commence_date = Number(d.lease_commence_date)
    d.resale_price = Number(d.resale_price)
    
    d.date = formatTime(parseTime(d.month))
    d.year = parseTime(d.month).getFullYear()
    d.month = formatMonth(parseTime(d.month))

    d.remainingyrs = d.year - d.lease_commence_date

    allyears.push(d.year)
    allmonths.push(d.month)
    alldates.push(d.date)
    alltowns.push(d.town)


  })

  // aggregate data
  // dates (year/month), measure (resale_price / floor_area_sqm etc)
  function avg(data, dates, timecol, measurecol) {

    // console.log(data, dates, timecol, measurecol)
    measureavg = []

    for (let y = 0; y < dates.length; y++) {
        durationlist = []

    for (let i = 0; i < data.length; i++) {
        if (data[i][timecol] == dates[y]){
          durationlist.push(data[i][measurecol])
        }
      }

      value = durationlist.reduce((a, b) => a + b, 0) / durationlist.length
      measureavg.push(value)

    }
    return measureavg
  }


  // set value of date range
  daterange = d3.extent(data, d => d.date);
  span1 = document.getElementById('dateLabel1')
  span1.textContent = daterange[0]
  span2 = document.getElementById('dateLabel2')
  span2.textContent = daterange[1]

  //date lists
  yrs = [...new Set(allyears)]
  months = [...new Set(allmonths)]
  dateall = [...new Set(alldates)]
  townsall = [...new Set(alltowns)]

  //default values
  resaleyravg = avg(data, yrs, 'year', 'resale_price')
  townresaleavg = avg(data, townsall, 'town', 'resale_price')

  // avgobject = {}
  // avgobject.year = yrs
  // avgobject.price = resalepriceavg

  //check value in time filter
  function checktime(time) {
    if (time == 'year') {
      return window.yrs
    }
    else if (time == 'month'){
      return window.months
    }
    else {
      return window.dateall
    }
  }

  // check value in value filter
  function checkval(value, xaxis, timecol) {
    if (value == 'resale_price') {

      // console.log('checking value', value)
      
      resaleavg = avg(data, xaxis, timecol, value)
      label = 'Avg Resale Price ($)'
      return [resaleavg, label]
      
    }
    // else if (time == 'month'){
    //   resalepriceavg = avg(data, yrs, 'year', 'resale_price')
    //   return updateline(time, resalepriceavg)
    // }
    // else {
    //   updateline(window.dateall, value)
    // }
  }

  // change value in filter
  $("#var-select").on("change", () => {
    console.log('change value')

    const value = $("#var-select").val()
    const time = $("#var-time-select").val()
    
    xaxis = checktime(time)

    valuecheck = checkval(value, xaxis, time)
    yaxis = valuecheck[0]
    ylabel = valuecheck[1]

    console.log(xaxis, yaxis)
    updateline(xaxis, yaxis, ylabel)
    updatebar(window.townsall, yaxis, ylabel)
  })

  // change time in filter
  $("#var-time-select").on("change", () => {
    console.log('change time')

    const value = $("#var-select").val()
    const time = $("#var-time-select").val()
    
    xaxis = checktime(time)

    valuecheck = checkval(value, xaxis, time)
    yaxis = valuecheck[0]
    ylabel = valuecheck[1]

    console.log(xaxis, yaxis)
    updateline(xaxis, yaxis, ylabel)
    updatebar(window.townsall, yaxis, ylabel)
  })

  d3.interval(() => {
    // flag = !flag
    // const newData = flag ? data : data.slice(1) 
    // update(newData) 
    
    update(data)
  }, 10000)


  console.log(d3.max(window.townresaleavg))
  createlinechart(window.yrs, window.resaleyravg)
  createbarchart(window.townsall, window.townresaleavg)
})



function update(data) {
  console.log('update all')

  //default filters
  document.getElementById('var-time-select').value = 'year'
  document.getElementById('var-select').value = 'resale_price'

  //default charts 
  // updateline(window.yrs, window.resaleyravg, 'Avg Resale Price ($)')
  updatebar(window.townsall, window.townresaleavg, 'Avg Resale Price ($)')
 
}

console.log('main done')

