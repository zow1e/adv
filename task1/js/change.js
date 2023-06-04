

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

  

  // change value in filter
$("#var-select").on("change", () => {
    console.log('change value')

    const value = $("#var-select").val()
    const time = $("#var-time-select").val()
    
    xaxis = checktime(time)

    valuecheck = checkval(value, time)
    yaxis = valuecheck[0]
    ylabel = valuecheck[1]
    updateline(xaxis, yaxis, ylabel)

    // valuecheck = checkval(value, 'town')
    // yaxis = valuecheck[0]
    // ylabel = valuecheck[1]
    // updatebar(townsall, yaxis, ylabel)

	  valuecheck = checkval(value, 'flat_model')
    yaxis = valuecheck[0]
    ylabel = valuecheck[1]
    updatetypearea(flatmodelall, yaxis, ylabel)

    valuecheck = checkval(value, 'town')
    yaxis = valuecheck[0]
    ylabel = valuecheck[1]
    if (ylabel != 'Count of Units') {
    updatestacked('Count', yaxis, ylabel) }
  })

  // change time in filter
$("#var-time-select").on("change", () => {
    console.log('change time')

    const value = $("#var-select").val()
    const time = $("#var-time-select").val()
    
    xaxis = checktime(time)

    valuecheck = checkval(value, time)
    yaxis = valuecheck[0]
    ylabel = valuecheck[1]

    // console.log('change time', yaxis)
    updateline(xaxis, yaxis, ylabel)
  })

  $("#var-town-select").on("change", () => {
    console.log('change town')
    townchange = $("#var-town-select").val()
    d = makeAgg(pdata)
    update(d)
  })



  // change indivs

  // $("#var-town-select").on("change", () => {
  //   console.log('change time')

  //   const value = $("#var-select").val()
  //   const time = $("#var-time-select").val()
  //   const town = $("#var-town-select").val()
    
  //   xaxis = checktime(time)

  //   valuecheck = checkval(value, xaxis, time)
  //   yaxis = valuecheck[0]
  //   ylabel = valuecheck[1]

  //   // console.log('change time', yaxis)
  //   updateline(xaxis, yaxis, ylabel)

  //   // valuecheck = checkval(value, 'flat_model')
  //   // yaxis = valuecheck[0]
  //   // ylabel = valuecheck[1]
  //   // updatetypearea(flatmodelall, yaxis, ylabel)

  //   // valuecheck = checkval(value, 'town')
  //   // yaxis = valuecheck[0]
  //   // ylabel = valuecheck[1]
  //   // if (ylabel != 'Count of Units') {
  //   // updatestacked('Count', yaxis, ylabel) }

  //   wranglePieData(town)
  // })

  // $("#var-type-select").on("change", () => {
  //   console.log('change time')

  //   const value = $("#var-select").val()
  //   const time = $("#var-time-select").val()
    
  //   xaxis = checktime(time)

  //   valuecheck = checkval(value, xaxis, time)
  //   yaxis = valuecheck[0]
  //   ylabel = valuecheck[1]

  //   // console.log('change time', yaxis)
  //   updateline(xaxis, yaxis, ylabel)
  // })

  // $("#var-model-select").on("change", () => {
  //   console.log('change time')

  //   const value = $("#var-select").val()
  //   const time = $("#var-time-select").val()
    
  //   xaxis = checktime(time)

  //   valuecheck = checkval(value, xaxis, time)
  //   yaxis = valuecheck[0]
  //   ylabel = valuecheck[1]

  //   // console.log('change time', yaxis)
  //   updateline(xaxis, yaxis, ylabel)
  // })