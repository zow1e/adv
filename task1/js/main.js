/*
*    main.js
*    Assignment 
*/

const parseTime = d3.timeParse("%Y-%m")
const formatTime = d3.timeFormat("%m/%Y")
const formatMonth = d3.timeFormat("%m")


monthNames = [ "January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December" ];


// import chart files
// let lineline
// let barfile


d3.csv("data/hdb-resale-prices_2000-2023May.csv").then(data => {
// d3.csv("data/small.csv").then(data => {
  data.forEach(d => {
    d.block = Number(d.block)
    d.floor_area_sqm = Number(d.floor_area_sqm)
    d.lease_commence_date = Number(d.lease_commence_date)
    d.resale_price = Number(d.resale_price)
    
    d.date = formatTime(parseTime(d.month))
    // d.date = parseTime(d.month)
    // d.date = d.month
    d.year = parseTime(d.month).getFullYear()
    d.month = formatMonth(parseTime(d.month))

    d.remainingyrs = d.year - d.lease_commence_date

  })
    // //   groups
    yearsgroup = d3.group(data, d => d.year)
    monthsgroup = d3.group(data, d => d.month)
    datesgroup = d3.group(data, d => d.date)
    townsgroup = d3.group(data, d => d.town)

    typegroup = d3.group(data, d => d.flat_type)
    modelgroup = d3.group(data, d => d.flat_model)

	// flattowngroup = d3.group(data, d => d.town, d => d.flat_type)

    //lists
    yrsall = Array.from(yearsgroup.keys()) // all years in dataset
    monthsall = Array.from(monthsgroup.keys())
    datesall = Array.from(datesgroup.keys())
    townsall = Array.from(townsgroup.keys())

    flattypeall = Array.from(typegroup.keys())
    // flatmodelall = Array.from(modelgroup.keys())
    

    // set value of date range
    span1 = document.getElementById('dateLabel1')
    span1.textContent = d3.min(datesall)
    span2 = document.getElementById('dateLabel2')
    span2.textContent = d3.max(datesall)

    //default values
    calcAverage = {avg(value, time) {
        rolled = d3.rollup(data, v => d3.mean(v, d => d[value]), d => d[time])
        arrayofvals = Array.from(rolled.values())
        return arrayofvals
    }}

    resaleyravg = calcAverage.avg('resale_price', 'year')
    townresaleavg = calcAverage.avg('resale_price', 'town')
    flattypeavg= calcAverage.avg('resale_price', 'flat_model')



  d3.interval(() => {
    
    // update(data)
  }, 10000)

  createlinechart(yrsall, resaleyravg)

  // create histogram + stacked barchart
  createbarchart(townsall, townresaleavg)

  // change to boxplot?
  // createtypeareachart(flattypeall, flattypeavg)
  createtypeareachart(modelgroup, flattypeavg)

  createstacked(data)

  createtypepie(data)
})


//check value in time filter
function checktime(time) {
    if (time == 'year') {
      return yrsall
    }
    else if (time == 'month'){
      return monthsall
    }
    else {
        // console.log(datesall)
      return datesall
    }
  }

  // check value in value filter
function checkval(value, xaxis, timecol) {
    if (value == 'resale_price') {
      resaleavg = calcAverage.avg(value, timecol)
      label = 'Avg Resale Price ($)'
      return [resaleavg, label]
      
    }
    else if (value == 'floor_area_sqm'){
		valavg = calcAverage.avg(value, timecol)
		label = 'Avg Floor Area (Sqm)'
		return [valavg, label]
    }
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
    updateline(xaxis, yaxis, ylabel)

    valuecheck = checkval(value, xaxis, 'town')
    yaxis = valuecheck[0]
    ylabel = valuecheck[1]
    updatebar(townsall, yaxis, ylabel)

	valuecheck = checkval(value, xaxis, 'flat_type')
    yaxis = valuecheck[0]
    ylabel = valuecheck[1]
    updatetypearea(flattypeall, yaxis, ylabel)
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

    // console.log('change time', yaxis)
    updateline(xaxis, yaxis, ylabel)
  })



function update(data) {
  console.log('update all')

  //default filters
  document.getElementById('var-select').value = 'resale_price'
  document.getElementById('var-time-select').value = 'year'
  

  //default charts 
  updateline(yrsall, resaleyravg, 'Avg Resale Price ($)')

  updatebar(townsall, townresaleavg, 'Avg Resale Price ($)')

  updatetypearea(modelgroup, flattypeavg, 'Avg Resale Price ($)')

  updatestacked(data, 'Count')

  updatetypepie
  

 
}

console.log('main done')

