/*
*    main.js
*    Assignment 
*/

const parseTime = d3.timeParse("%Y-%m")
const formatTime = d3.timeFormat("%m-%Y")

monthNames = [ "January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December" ];


let flag = true

let lineline


d3.csv("data/hdb-resale-prices_2000-2023May.csv").then(data => {
  // d3.csv("data/small.csv").then(data => {

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
    d.month = parseTime(d.month).getMonth()

    d.remainingyrs = d.year - d.lease_commence_date

    allyears.push(d.year)
    allmonths.push(d.month)
    alldates.push(d.date)


  })

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


  // set value of date range
  daterange = d3.extent(data, d => d.date);
  span1 = document.getElementById('dateLabel1')
  span1.textContent = daterange[0]
  span2 = document.getElementById('dateLabel2')
  span2.textContent = daterange[1]

  yrs = [...new Set(allyears)]
  months = [...new Set(allmonths)]
  dateall = [...new Set(alldates)]

  resalepriceavg = avg(data, yrs, 'year', 'resale_price')

  avgobject = {}
  avgobject.year = yrs
  avgobject.price = resalepriceavg

  function checktime(time, value) {
    if (time == 'year') {
      updateline(window.yrs, value)
    }
    else if (time == 'month'){
      updateline(window.monthNames, value)
    }
    else {
      updateline(window.dateall, value)
    }
  }

  $("#var-select").on("change", () => {
    const value = $("#var-select").val()
    const time = $("#var-time").val()

    checktime(time, value)
  })

  $("#var-time-select").on("change", () => {
    const value = $("#var-select").val()
    const time = $("#var-time").val()
    
    checktime(time, value)
  })

  d3.interval(() => {
    // flag = !flag
    // const newData = flag ? data : data.slice(1) 
    // update(newData) 
    
    update(data)
  }, 500)

  
  // update(data)
  createlinechart(window.yrs, window.resalepriceavg)
  // linevalues = createlinechart(window.yrs, window.resalepriceavg)
  // linex = linevalues[0]
  // liney = linevalues[1]
  // console.log(linevalues)
})



function update(data) {
  updateline(window.yrs, window.resalepriceavg)
 
}

console.log('main done')

