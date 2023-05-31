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

    d.remainingyrs = (d.lease_commence_date + 99) - d.year

  })
  // data.sort((d, k )=> {
  //   return d3.ascending(d.resale_price, k.resale_price)
  // })

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
    flatmodelall = Array.from(modelgroup.keys())
    

    // set value of date range
    span1 = document.getElementById('dateLabel1')
    span1.textContent = d3.min(datesall)
    span2 = document.getElementById('dateLabel2')
    span2.textContent = d3.max(datesall)

    //default values
    calcs = {avg(value, time) {
        rolled = d3.rollup(data, v => d3.mean(v, d => d[value]), d => d[time])
        arrayofvals = Array.from(rolled.values())
        return arrayofvals
    },
  count(time){
    rolled = d3.rollup(data, v =>v.length, d => d[time])
        arrayofvals = Array.from(rolled.values())
        return arrayofvals
  }
}

    resaleyravg = calcs.avg('resale_price', 'year')
    townresaleavg = calcs.avg('resale_price', 'town')
    flattypeavg= calcs.avg('resale_price', 'flat_model')



  d3.interval(() => {
    
    update(data)
  }, 10000)

  createlinechart(yrsall, resaleyravg)

  // create histogram + stacked barchart
  createbarchart(townsall, townresaleavg)

  // change to boxplot?
  // createtypeareachart(flattypeall, flattypeavg)
  createtypeareachart(flatmodelall, flattypeavg)

  createstacked(data, townresaleavg)

  createtypepie(data)
})



function update(data) {
  console.log('update all')

  //default filters
  document.getElementById('var-select').value = 'resale_price'
  document.getElementById('var-time-select').value = 'year'
  

  //default charts 
  updateline(yrsall, resaleyravg, 'Avg Resale Price ($)')

  updatebar(townsall, townresaleavg, 'Avg Resale Price ($)')

  updatetypearea(flatmodelall, flattypeavg, 'Avg Resale Price ($)')

  updatestacked('Count', data, townresaleavg, 'Avg Resale Price ($)')

  updatetypepie()
  

 
}

console.log('main done')
