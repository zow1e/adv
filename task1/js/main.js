/*
*    main.js
*    Assignment 
*/

const parseTime = d3.timeParse("%Y-%m")
const formatTime = d3.timeFormat("%m/%Y")
const formatMonth = d3.timeFormat("%m")


monthNames = [ "January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December" ];

let nestedCalls
let calcs

let bar
let line
let stack
let pie


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

  // set value of items
  datesgroup = d3.group(data, d => d.date)
  datesall = Array.from(datesgroup.keys())

  span1 = document.getElementById('dateLabel1')
  span1.textContent = d3.min(datesall)
  span2 = document.getElementById('dateLabel2')
  span2.textContent = d3.max(datesall)
  
  townsgroup = d3.group(data, d => d.town)
  townsall = Array.from(townsgroup.keys())
  var select = document.getElementById('var-town-select')
  townsall.forEach(t => {
    select.add(new Option(t, t))
  })

  d3.interval(() => {
    //default filters
    document.getElementById('var-select').value = 'resale_price'
    document.getElementById('var-time-select').value = 'year'
    document.getElementById('var-town-select').value = 'town'

    // newdata = makeAgg(data)
    // reset(data)
    update(data)
  }, 10000)

  calcs = {avg(value, time) {
    rolled = d3.rollup(data, v => d3.mean(v, d => d[value]), d => d[time])
    arrayofvals = Array.from(rolled.values())
    return arrayofvals
  },
  count(val){
    rolled = d3.rollup(data, v =>v.length, d => d[val])
        arrayofvals = Array.from(rolled.values())
        return arrayofvals
  }
  }

  bar = new BarChart("#type-area", data)
  line = new LineChart("#line-chart", data)
  stack = new StackedChart("#stacked", data)
  pie = new PieChart("#pie-chart", data)

  townchange = $("#var-town-select").val()
  // console.log(data)
  d = filterTown(townchange, data)
  
  // change value in filter
  $("#var-select").on("change", () => {
    console.log('change value')

    const value = $("#var-select").val()

    if (value != 'units_sold') {
      stack.wrangleData(d) }

    line.wrangleData(d)
    bar.wrangleData(d)
  })

  // change time in filter
  $("#var-time-select").on("change", () => {
    console.log('change time')

    line.wrangleData(d)
  })

  $("#var-town-select").on("change", () => {
  console.log('change town')
  townchange = $("#var-town-select").val()

  newd = filterTown(townchange, d)
  update(newd)
  })

})



function filterTown(filter, gdata){
  // console.log(gdata)
  if (filter == 'town') {
    return gdata
  }
  else {
    data = []
    gdata.forEach(d => {
      if (d.town == filter){
      data.push(d)}
    })
    return data
  }
}

// function reset(data){

//   console.log('reset all')

//   bar.wrangleData(data)
//   line.wrangleData(data)
//   stack.wrangleData(data)
//   pie.wrangleData(data)

// }


function update(data) {
  // console.log('update all')

  townsgroup = d3.group(data, d => d.town)
  townsall = Array.from(townsgroup.keys())
  

  bar.wrangleData(data)
  line.wrangleData(data)
  stack.wrangleData(data)
  pie.wrangleData(data)
}

function createNest(xaxis, yaxis){
  data = []
    //combined dataset
    xaxis.forEach((d, i )=> {
      data.push({
        'key': d,
        'value': yaxis[i]
      })
    })
    return data
  }

// console.log('main done')

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
function checkval(value,timecol) {
  if (value == 'resale_price') {
    resaleavg = calcs.avg(value, timecol)
    label = 'Avg Resale Price ($)'
    return [resaleavg, label]
    
  }
  else if (value == 'floor_area_sqm'){
  valavg = calcs.avg(value, timecol)
  label = 'Avg Floor Area (Sqm)'
  return [valavg, label]
  }
  else if (value == 'units_sold'){
  rolled = calcs.count(timecol)
  label = 'Count of Units'
  return [rolled, label]
  }
}

function lableCheck(d, ylabel) {
  if (ylabel == 'Avg Resale Price ($)'){
    return "$" + d
  }
  else {
    return d
  }
}



