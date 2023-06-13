/*
*    main.js
*    Assignment 
*/

const parseTime = d3.timeParse("%Y-%m")
const formatTime = d3.timeFormat("%m/%Y")
const formatMonth = d3.timeFormat("%m")


let nestedCalls;
let calcs;

let bar;
let line;
let stack;
let pie;


d3.csv("data/hdb-resale-prices_2000-2023May.csv").then(data => {
  const extentdate = d3.extent(data, d=> d.month)

  span1 = document.getElementById('dateLabel1')
  span1.textContent = extentdate[0]
  span2 = document.getElementById('dateLabel2')
  span2.textContent = extentdate[1]

  data.forEach(d => {
    d.block = Number(d.block)
    d.floor_area_sqm = Number(d.floor_area_sqm)
    d.lease_commence_date = Number(d.lease_commence_date)
    d.resale_price = Number(d.resale_price)
    
    d.date = formatTime(parseTime(d.month))
    d.year = parseTime(d.month).getFullYear()
    // d.month = formatMonth(parseTime(d.month))
    d.month = parseTime(d.month).getMonth()

    d.remainingyrs = (d.lease_commence_date + 99) - d.year

  })
  // data.sort((d, k )=> {
  //   return d3.ascending(d.resale_price, k.resale_price)
  // })

  // set value of items

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

    update(data)
  }, 10000)

  calcs = {avg(value, time, d) {
    rolled = d3.rollup(d, v => d3.mean(v, d => d[value]), d => d[time])
    arrayofvals = Array.from(rolled.values())
    return arrayofvals
  },
    count(val, d){
      rolled = d3.rollup(d, v =>v.length, d => d[val])
          arrayofvals = Array.from(rolled.values())
          return arrayofvals
    }
  }

  bar = new BarChart("#type-area", data)
  line = new LineChart("#line-chart", data)
  stack = new StackedChart("#stacked", data)
  pie = new PieChart("#pie-chart", data)


  // townchange = $("#var-town-select").val()
  // d = filterTown(townchange, data)
  // console.log(d)
  
  // change value in filter
  $("#var-select").on("change", () => {
    console.log('change value')

    const value = $("#var-select").val()

    if (value != 'units_sold') {
      stack.wrangleData(data) }

    line.wrangleData(data)
    bar.wrangleData(data)
  })

  // change time in filter
  $("#var-time-select").on("change", () => {
    console.log('change time')

    line.wrangleData(data)
  })

  $("#var-town-select").on("change", () => {
  console.log('change town')
  townchange = $("#var-town-select").val()

  newd = filterTown(townchange, data)
  update(newd)
  })

})


function filterTown(filter, gdata) {
  if (filter == 'town') {
    return gdata
  }
  else {
    const data = []
    gdata.forEach(d => {
      if (d.town == filter){
      data.push(d)}
    })
    return data
  }
}


function update(data) {

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


function checktime(time, og) {
  if (time == 'year') {
    return yrsall
  }
  else if (time == 'month'){
    return monthsall
  }
  else {
    const data = []
    og.forEach(d => {
      if (d.year == time){
      data.push(d)}
    })
    return Array.from(new Set(data.map((d) => d.month)))
  }
}

// check value in value filter
function checkval(value,timecol, d) {
  if (value == 'resale_price') {
    resaleavg = calcs.avg(value, timecol, d)
    label = 'Avg Resale Price ($)'
    return [resaleavg, label]
    
  }
  else if (value == 'floor_area_sqm'){
  valavg = calcs.avg(value, timecol, d)
  label = 'Avg Floor Area (Sqm)'
  return [valavg, label]
  }
  else if (value == 'units_sold'){
  rolled = calcs.count(timecol, d)
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



