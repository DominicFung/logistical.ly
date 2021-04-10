export function logistic2 (sorted: data[], request: any, maxCapacity: any): { minPrice: number, sortedLane: {[key: string]: data[]} }|null {
  log("Logistics v2 start ... sorting")

  // NOTE: for a more optimal solution,
  //       we should be sorting BY LANE during the read CSV phase ..
  //       but the requirment came in last minute.

  let capacityTracker = request
  let maxCapacityTracker = maxCapacity
  let minPrice = 0

  let lanePrioritizer = []
  let sortedLane = {} as {[key: string]: data[]}

  for (let item of sorted) {
    if (!sortedLane[item.lane]) {
      lanePrioritizer.unshift(item.lane)
      sortedLane[item.lane] = [item]
    } else {
      sortedLane[item.lane].push(item)
    }
  }

  for (let lane of lanePrioritizer) {
    for (let item of sortedLane[lane]) {
      if (capacityTracker[item.lane] >= 0 && maxCapacityTracker[item.company] >= 0) {
        item.allocation = Math.min(capacityTracker[item.lane], maxCapacityTracker[item.company], item.capacity)
  
        maxCapacityTracker[item.company] = maxCapacityTracker[item.company] - item.allocation
        capacityTracker[item.lane] = capacityTracker[item.lane] - item.allocation
        minPrice = minPrice + item.price * item.allocation
      } else { 
        warn(`capacityTracker[${item.lane}] or maxCapacity[${item.company}] is not >= 0!`) 
      }
    } 
  }

  log(JSON.stringify(sortedLane))
  log(JSON.stringify(minPrice))

  let errorLane = checkSolved(capacityTracker)
  if (errorLane) {
    error(`Not all lanes were allocated! Please check lane "${errorLane}"`)
    return null
  } else {
    answer(`V2 Minimum Price = ${minPrice}`)
    return { minPrice, sortedLane }
  }
}


/**
  * @param { { "company-lane": {price: number, capcity: number } ... } } legend 
  * @param { { "lane": number ... } } request
  * @param { { "company": number ... } } maxCapacity
  * 
  * @return {number}
  */
export function logistic (sorted: data[], request: any, maxCapacity: any): { minPrice: number, sorted: data[] }|null {
  log("Logistics v1 start ... sorting")

  let capacityTracker = request
  let maxCapacityTracker = maxCapacity
  let minPrice = 0

  /**
   * Allocate based on price, item capacity and max capacity
   * Complexity: O(n)
   */
  for (let item of sorted) {
    if (capacityTracker[item.lane] >= 0 && maxCapacityTracker[item.company] >= 0) {
      item.allocation = Math.min(capacityTracker[item.lane], maxCapacityTracker[item.company], item.capacity)

      maxCapacityTracker[item.company] = maxCapacityTracker[item.company] - item.allocation
      capacityTracker[item.lane] = capacityTracker[item.lane] - item.allocation
      minPrice = minPrice + item.price * item.allocation
    } else { warn(`capacityTracker[${item.lane}] or maxCapacity[${item.company}] doesn't exist!`) }
  }

  log(JSON.stringify(sorted))
  log(JSON.stringify(minPrice))
  log(JSON.stringify(capacityTracker))
  log(JSON.stringify(maxCapacityTracker))

  console.log(maxCapacityTracker)
  console.log(capacityTracker)

  if (!checkSolved(capacityTracker)) {
    answer(`V1 Minimum Price = ${minPrice}`)
    return { minPrice, sorted }
  } else {
    log("\n -- BACKTRACKING -- ")

    /**
     * Backtracking:
     *  - For each lane, Check to see if the request is statisfied: ie. outstanding capacity lane = 0
     *  - If NOT - recursively make alterations until:
     *      a) max Capacity per company is not violated
     *      b) all lanes are equal
     */
    let isSolved = false
    for (let lane of Object.keys(capacityTracker)) {
      if (capacityTracker[lane] > 0) {
        for (let i=0; i<sorted.length; i++) {
          if (sorted[i].lane === lane) {
            if (i === 0) throw ("We cannot handle i === 0 yet.")
            let temp = modify(sorted, maxCapacityTracker, capacityTracker, i-1, i, "lane", lane, minPrice)
            if (temp) {
              sorted = temp.sorted
              capacityTracker = temp.laneT
              maxCapacityTracker = temp.companyMaxT
              minPrice = temp.price

              isSolved = true
              break; // I think the entire thing is solved if modify returns?

            } else console.warn(`Could not solve at i = ${i}.`)
          }
        }
      }
    }

    console.log(maxCapacityTracker)
    console.log(capacityTracker)

    let errorLane = checkSolved(capacityTracker)
    if (errorLane) {
      error(`Not all lanes were allocated! Please check lane "${errorLane}"`)
      return null
    } else {
      answer(`V1 Minimum Price = ${minPrice}`)
      return { minPrice, sorted }
    }
  }
 }

 /**
 * 
 * @param {*} sorted                    : filled, sorted master data
 * @param {*} companyMaxT               : tracks maximum capacity of each company; + number means that company still has capacity
 * @param {*} laneT                     : tracks currently allocated capacity for each lane; + number means, we still need to fill that number in lane
 * @param {number} bpointer             : pointer for backtracking; used when a "reduction" is needed
 * @param {number} fpointer             : pointer for forwardtracking; used when an "addition" is needed
 * @param {"company"|"lane"} actionItem : "company" or "lane"
 * @param {number} value                : any number -- this will determine if we iterate on bpointer or fpointer
 */
const modify = (
  sorted: data[], 
  companyMaxT: any, 
  laneT: any, 
  bpointer:number, 
  fpointer:number, 
  actionItem: "company"|"lane", 
  key: string, 
  price: number
): null|{ sorted: data[], companyMaxT: any, laneT: any, price: number } => {
  let lowestValue = null
  let value = actionItem === "lane" ? laneT[key] : companyMaxT[key]
  console.log(`\n-|- NEW ITERATION -|- value: ${value}`)
  console.log(`fpointer ${fpointer} ${value}`)

  if (value > 0) {
    if (fpointer >= sorted.length) return null
    let modified = []

    // Complete the action:
    while (fpointer < sorted.length && value > 0) {
      log(`fpointer ${fpointer} ${value}`)
      log(actionItem)
      log(key)

      if (actionItem === "lane"? sorted[fpointer].lane === key : sorted[fpointer].company === key) {
        let item = sorted[fpointer]
          let addAmount = Math.min(Math.abs(value), item.capacity-(item.allocation?item.allocation:0))
          log(JSON.stringify(addAmount))
          value = value - addAmount

          item.allocation = item.allocation?item.allocation:0 + addAmount
          companyMaxT[actionItem === "lane"? item.company : key] = 
            companyMaxT[actionItem === "lane"? item.company : key] - addAmount
          laneT[item.lane] = laneT[item.lane] - addAmount
          price = price + (addAmount * item.price)

          log(JSON.stringify(item))
          modified.push(item)
          
          log(companyMaxT[item.company])
          log(laneT[item.lane])
      }
      fpointer = fpointer + 1
    }

    if (value === 0) { //action was successful, we want to begin counter balance
      let isOK = true
      for (let item of modified) {

        log(`companyMaxT[${item.company}] ${companyMaxT[item.company]}`)
        if (companyMaxT[item.company] < 0) {
          isOK = false
          let temp = modify(sorted, companyMaxT, laneT, bpointer, fpointer, "company", item.company, price)
          if (temp && (lowestValue === null || temp.price < lowestValue.price)) lowestValue = temp
        }

        log(`laneT[${item.lane}] ${laneT[item.lane]}`)
        if (laneT[item.lane] < 0) {
          isOK = false
          let temp = modify(sorted, companyMaxT, laneT, bpointer, fpointer, "lane", item.lane, price)
          if (temp && (lowestValue === null || temp.price < lowestValue.price)) lowestValue = temp
        }
      }

      log(`isOK ${isOK}`)
      log(JSON.stringify(lowestValue))
      
      if (isOK && !lowestValue) return { sorted, companyMaxT, laneT, price }
      if (lowestValue) return lowestValue
    } return null
  } else if (value < 0) {
    log(JSON.stringify(bpointer))

    if (bpointer < 0) return null
    let modified = []

    while (bpointer >= 0 && value < 0) {
      log(`bpointer ${bpointer} ${value}`)
      log(actionItem)
      log(key)
      
      if (actionItem === "lane"? sorted[bpointer].lane === key : sorted[bpointer].company === key) {
        let item = sorted[bpointer]
        let minusAmount = Math.min(-value, item.allocation? item.allocation:0)
        value = value + minusAmount

        item.allocation = item.allocation?item.allocation:0 - minusAmount
        companyMaxT[actionItem === "lane"? item.company : key] = 
          companyMaxT[actionItem === "lane"? item.company : key] + minusAmount
        laneT[item.lane] = laneT[item.lane] + minusAmount
        price = price - (minusAmount * item.price)

        log(JSON.stringify(item))
        modified.push(item)

        log(companyMaxT[item.company])
        log(laneT[item.lane])
      }
      bpointer = bpointer - 1
    }

    if (value === 0) { //action was successful, we want to begin counter balance
      let isOK = true
      for (let item of modified) {
        log(`companyMaxT[${item.company}] ${companyMaxT[item.company]}`)
        if (companyMaxT[item.company] < 0) {
          isOK = false
          let temp = modify(sorted, companyMaxT, laneT, bpointer, fpointer, "company", item.company, price)
          if (temp && (lowestValue === null || temp.price < lowestValue.price)) lowestValue = temp
        }

        log(`laneT[${item.lane}] ${laneT[item.lane]}`)
        if (laneT[item.lane] < 0) {
          isOK = false
          let temp = modify(sorted, companyMaxT, laneT, bpointer, fpointer, "lane", item.lane, price)
          if (temp && (lowestValue === null || temp.price < lowestValue.price)) lowestValue = temp
        }

        if (laneT[item.lane] > 0) {
          isOK = false
          let temp = modify(sorted, companyMaxT, laneT, bpointer, fpointer, "lane", item.lane, price)
          if (temp && (lowestValue === null || temp.price < lowestValue.price)) lowestValue = temp
        }
      }

      log(`isOK ${isOK}`)
      log(JSON.stringify(lowestValue))

      if (isOK && !lowestValue) return { sorted, companyMaxT, laneT, price }
      if (lowestValue) return lowestValue
    } return null
  } return { sorted, companyMaxT, laneT, price }
}

function log(logMsg: string) {
  const event = new CustomEvent('logistic-log', {
    detail: {log: logMsg, level: "TRACE"}
  })
  console.log(logMsg)
  document.body.dispatchEvent(event)
}

export function warn(logMsg: string) {
  const event = new CustomEvent('logistic-log', {
    detail: {log: logMsg, level: "WARN"}
  })
  console.warn(logMsg)
  document.body.dispatchEvent(event)
}

export function error(logMsg: string) {
  const event = new CustomEvent('logistic-log', {
    detail: {log: logMsg, level: "ERROR"}
  })
  console.warn(logMsg)
  document.body.dispatchEvent(event)
}

function answer(logMsg: string) {
  const event = new CustomEvent('logistic-log', {
    detail: {log: logMsg, level: "ANSWER"}
  })
  console.log(logMsg)
  document.body.dispatchEvent(event)
}

/**
 * 
 * @param laneTracker 
 * @returns null if everything is OK.
 *      Returns the string lane if not OK
 */
function checkSolved(laneTracker: {[lane: string]: number} ): null|string {
  let lanes = Object.keys(laneTracker)
  for (let lane of lanes) {
    if (laneTracker[lane] !== 0) return lane
  }
  return null
}