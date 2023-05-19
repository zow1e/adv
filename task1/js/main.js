/*
*    main.js
*    Assignment 
*/

const parseTime = d3.timeParse("%Y-%m")
const formatTime = d3.timeFormat("%m-%Y")
const formatMonth = d3.timeFormat("%m")

monthNames = [ "January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December" ];


let flag = true

let lineline


// d3.csv("data/hdb-resale-prices_2000-2023May.csv").then(data => {
  d3.csv("data/small.csv").then(data => {

    var allyears = []
    var allmonths = []
    var alldates = []
    

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


  })

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

      console.log(durationlist)

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

  yrs = [...new Set(allyears)]
  months = [...new Set(allmonths)]
  dateall = [...new Set(alldates)]

  console.log(months)

  

  //default values
  resalepriceavg = avg(data, yrs, 'year', 'resale_price')

  // avgobject = {}
  // avgobject.year = yrs
  // avgobject.price = resalepriceavg

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
  })

  d3.interval(() => {
    // flag = !flag
    // const newData = flag ? data : data.slice(1) 
    // update(newData) 
    
    update(data)
  }, 1000)

  
  // update(data)
  createlinechart(window.yrs, window.resalepriceavg)
  // linevalues = createlinechart(window.yrs, window.resalepriceavg)
  // linex = linevalues[0]
  // liney = linevalues[1]
  // console.log(linevalues)
})



function update(data) {
  //default charts 
  
  // updateline(window.yrs, window.resalepriceavg)
 
}

console.log('main done')

