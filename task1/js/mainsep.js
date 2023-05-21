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


// d3.csv("data/hdb-resale-prices_2000-2023May.csv").then(data => {
d3.csv("data/small.csv").then(data => {
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
    // yearsgroup.forEach(d => {
    //   d.avg_rp = d3.mean(d.values, p => p.resale_price) 
    // })

    monthsgroup = d3.group(data, d => d.month)
    datesgroup = d3.group(data, d => d.date)
    townsgroup = d3.group(data, d => d.town)

    typegroup = d3.group(data, d => d.flat_type)

	flattowngroup = d3.group(data, d => d.town, d => d.flat_type)

	// console.log('values?', flattowngroup.values())

	// dataFiltered = townsgroup
	// 	.map(day => day.values.reduce(
	// 	    (accumulator, current) => {
	// 	        accumulator.town = day.key
	// 	        accumulator[current.flat_type] = accumulator[current.flat_type] + current['resale_price']
	// 	        return accumulator
	// 	    }, {
    //       "4 ROOM": 0,
    //       "3 ROOM": 0,
    //       "5 ROOM": 0
    //     }
    //   ))

	dataFiltered = Array.from(d3
		.group(data, d => d.town)) // replace original nest method with d3.group with rawData as first parameter and callback as second that called by d3.nest().key method. And convert it to array by Array.from method so that it has map method called next step.
		// .key(d => d.year)
		// .entries(rawData)
		.map(d => { // replace previous rollup method
		  // d[1] as object to replace d directly
		//   const pairs = d[1].map(v => [v.flat_type, v.resale_price, v.floor_area_sqm])

		  // d[0] as key and d[1] as values those maybe the object structure by nest() 
		  return {
			key: d[0],
			values: d[1]
		  };
		})

	  console.log(dataFiltered)
	  console.log('group function', flattowngroup)

	  console.log(dataFiltered[0].values[0].resale_price)

	// hierarchytown = d3.hierarchy(flattowngroup)
	// console.log(hierarchytown.children[0].data)
	// // hiermeans = hierarchytown.copy().sum(d => d.resale_price)
	// // console.log(hiermeans.value)

	// function getWithAverageScore(objToRecurse) {
	// 	// map = d3.map()
	// 	// If I have a score I am already done
	// 	  if (typeof objToRecurse.resale_price != undefined) {
	// 		  return objToRecurse;
	// 	  }
	// 	// Otherwise, I get my children with their average score
	// 	  const childrens = objToRecurse.children.map(getWithAverageScore());
	// 	// console.log(objToRecurse.children)
	  
	// 	  return {
	// 		  ...objToRecurse,
	// 		  childrens,
	// 	  // And I set my scoreAvg to their average (score or scoreAvg)
	// 		  scoreAvg: childrens.reduce((total, { resale_price, scoreAvg }) => total + (resale_price || scoreAvg), 0) / children.length
	// 	  };
	//   }
	  
	//   console.log(getWithAverageScore(hierarchytown))

	// console.log(flattowngroup.values())
	// roomoftown = []
	// flattowngroup.values().map(d => {
	// 	types = d.values()
	// 	types.forEach(t => {
	// 		valuesarr = t.values()
	// 		console.log(valuesarr.resale_price)
	// 	})
	// })

	// d3.rollups(data, v => d3.mean(v, d => d.resale_price), d => d.flat_type)


	total = flattowngroup.get('clem').get('3 ROOM')[0].resale_price+flattowngroup.get('clem').get('3 ROOM')[1].resale_price
	console.log(total/flattowngroup.get('clem').get('3 ROOM').length)
    
    

    //lists
    yrsall = Array.from(yearsgroup.keys()) // all years in dataset
    monthsall = Array.from(monthsgroup.keys())
    datesall = Array.from(datesgroup.keys())
    townsall = Array.from(townsgroup.keys())

    flattypeall = Array.from(typegroup.keys())
    // flattypeall = d3.groupSort(data, g => d3.mean(g, d => d.floor_area_sqm), d => d.flat_type)



    // console.log(flattypeall)

    // towntypegroup = d3.group(data, d => d.town)

    // console.log('town and type')
    // dataFiltered = towntypegroup
    //   .map(day => day.values.reduce(
    //     (accumulator, current) => {
    //         accumulator.town = day.key
    //         accumulator[current.flat_type] = accumulator[current.flat_type] + current['resale_price']
    //         return accumulator
    //     }, {
    //       flattypeall[0]: 0,
    //       flattypeall[1]: 0,
    //       flattypeall[2]: 0,
    //       flattypeall[3]: 0,
    //       flattypeall[4]: 0,
    //       flattypeall[5]: 0,
    //       flattypeall[6]: 0,

    //     }
    //   ))

    //   console.log(dataFiltered)



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
    flattypeavg= calcAverage.avg('resale_price', 'flat_type')
    // flattypeavg = calcAverage.avg('resale_price', 'flat_type')
    // console.log(flattypeavg)
  //   towntypearea = d3.rollup(function(v) {
  //     return {
  //         count: v.length,
  //         // total: d3.sum(d3.values(v[0].quant)),
  //         avg: d3.mean(d3.values(v[0].quant))
  //     };
  // })
  // eachtown = Array.from(towntypegroup.values())
    // console.log(d3.flatMap(eachtown[0]))
    // console.log(towntypearea)
    

  d3.interval(() => {
    
    update()
  }, 10000)

  createlinechart(yrsall, resaleyravg)
  createbarchart(townsall, townresaleavg)
  createtypeareachart(flattypeall, flattypeavg)
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
        console.log(datesall)
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
    updateline(xaxis, yaxis, ylabel)

    valuecheck = checkval(value, xaxis, 'town')
    yaxis = valuecheck[0]
    ylabel = valuecheck[1]
    updatebar(townsall, yaxis, ylabel)

	valuecheck = checkval(value, xaxis, 'flat_type')
    yaxis = valuecheck[0]
    ylabel = valuecheck[1]
    updatetypearea(townsall, yaxis, ylabel)
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

    console.log('change time', yaxis)
    updateline(xaxis, yaxis, ylabel)
  })



function update() {
  console.log('update all')

  //default filters
  document.getElementById('var-select').value = 'resale_price'
  document.getElementById('var-time-select').value = 'year'
  

  //default charts 
  updateline(yrsall, resaleyravg, 'Avg Resale Price ($)')

  updatebar(townsall, townresaleavg, 'Avg Resale Price ($)')

  updatetypearea(flattypeall, flattypearea, 'Avg Resale Price ($)')
  
 
}

console.log('main done')

