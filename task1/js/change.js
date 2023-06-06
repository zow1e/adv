

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
//   let d
//   townchange = $("#var-town-select").val()
//   console.log(pdata)
//   d = filterTown(townchange, pdata)
  
  

//   // change value in filter
// $("#var-select").on("change", () => {
//     console.log('change value')

//     const value = $("#var-select").val()

//     if (value != 'units_sold') {
//       stack.wrangleData() }

//     line.wrangleData(d)
//     bar.wrangleData(d)
//   })

//   // change time in filter
// $("#var-time-select").on("change", () => {
//     console.log('change time')

//     line.wrangleData(d)
//   })

// $("#var-town-select").on("change", () => {
//   console.log('change town')
//   townchange = $("#var-town-select").val()

//   newd = filterTown(townchange, d)
//   update(newd)
// })
