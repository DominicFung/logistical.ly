import { warn as logWarn, error as logError } from './logistic'

const _PRICESCSVNAME = "prices.csv"
const _CAPACITYCSVNAME = "capacity.csv"

const _NULLVALS = [ "NA", "" ]

/**
 * 
 * @param price 
 * @param capacity 
 */
export function csvReader2(prices: rowData[], capacities: rowData[]): data[] {

  if (prices.length === 0 || capacities.length === 0) {
    logError(`There is no data in either ${_PRICESCSVNAME} or ${_CAPACITYCSVNAME}.`)
    throw `There is no data in either ${_PRICESCSVNAME} or ${_CAPACITYCSVNAME}.`
  }

  if (prices.length !== capacities.length) { 
    logError(`Number of lines in ${_PRICESCSVNAME} and ${_CAPACITYCSVNAME} are different!`)
    throw `Number of lines in ${_PRICESCSVNAME} and ${_CAPACITYCSVNAME} are different!`
  }

  if (Object.keys(prices[0].companies).length !== Object.keys(capacities[0].companies).length) {
    logError(`Number of companies in ${_PRICESCSVNAME} and ${_CAPACITYCSVNAME} are different!`)
    throw `Number of companies in ${_PRICESCSVNAME} and ${_CAPACITYCSVNAME} are different!`
  }

  let headers = Object.keys(prices[0].companies)
  console.log(headers)
  let sorted = [] as data[]

  for (let i=0; i<prices.length; i++) {
    if (Object.keys(prices[i].companies).length !== headers.length) {
      logError(`There are more companies on row ${i+1} in ${_PRICESCSVNAME} than in the header.`)
      throw `There are more companies on row ${i+1} in ${_PRICESCSVNAME} than in the header.`
    }

    if (Object.keys(capacities[i].companies).length !== headers.length) {
      logError(`There are more companies on row ${i+1} in ${_CAPACITYCSVNAME} than in the header.`)
      throw `There are more companies on row ${i+1} in ${_CAPACITYCSVNAME} than in the header.`
    }

    for (let company of headers) {
      let price = prices[i].companies[company]
      let capacity = capacities[i].companies[company]

      if ( !(_NULLVALS.includes(price) || _NULLVALS.includes(capacity)) ) {
        let priceValue = parseFloat(price)
        let capacityValue = parseInt(capacity)

        if (!Number.isNaN(price) && !Number.isNaN(capacity))
          sorted = insertion(sorted, company, prices[i].lane, { price: priceValue, capacity: capacityValue } as item)
        else throw `cell(${i}, ${company}) has price "${price}" and capacity "${capacity}". One of which is "Not A Number".`
      } else logWarn(`Acceptable null value found in cell(${i}, ${company}). skipping ..`)
    }
  }

  return sorted
}

/**
 * CSV Reader for logistics algorithm.
 * Sorts the data from lowest price to highest price.
 * @param {*} priceCSV 
 * @param {*} capacityCSV 
 */
export function csvReader(priceCSV: string, capacityCSV: string): data[] {
  var priceLines = priceCSV.split("\n")
  var capacityLines = capacityCSV.split("\n")

  if (priceLines.length !== capacityLines.length) throw `Number of lines in ${_PRICESCSVNAME} and ${_CAPACITYCSVNAME} are different!`
  if (priceLines[0] !== capacityLines[0]) throw `Company Names are miss-matched in the header between ${_PRICESCSVNAME} and ${_CAPACITYCSVNAME}`
  var sorted = [] as data[]

  // NOTE: For now, we do not expect company, lane numbers and values to contain "," - if so, we will need to refactor this code
  var headers = priceLines[0].split(",")
  console.log(headers)

  for (let i=1; i<priceLines.length; i++) {
    let priceLine = priceLines[i].split(",")
    let capacityLine = capacityLines[i].split(",")
    
    if (priceLine[0] !== capacityLine[0]) 
      throw `${_PRICESCSVNAME} contains lane "${priceLine[0]}" in row ${i}, but ${_CAPACITYCSVNAME} contains lane "${capacityLines[0]}" instead. Please make them the same.`

    if (priceLine.length !== headers.length || capacityLine.length !== headers.length)
      throw `${_PRICESCSVNAME} or ${_CAPACITYCSVNAME} do not contain the same number of cells as the header on row ${i}. ${priceLine.length}, ${capacityLine.length} respectively.`

    for (let j=1; j<priceLine.length; j++) {
      let company = removeQuotes(headers[j])
      let lane = removeQuotes(priceLine[0])

      // NOTE: following are epected to be numbers OR part of _NULLVALS
      let price = removeQuotes(priceLine[j])
      let capacity = removeQuotes(capacityLine[j])

      //console.log(`priceLine[${j}] = ${priceLine[j]}; capacityLine[${j}] = ${capacityLine[j]}`)
      
      if (!(_NULLVALS.includes(price) || _NULLVALS.includes(capacity))){
        let priceValue = parseFloat(price)
        let capacityValue = parseInt(capacity)

        //console.log(`price "${price}" isNaN? ${Number.isNaN(price)}; capacity "${capacity}" isNaN? ${Number.isNaN(capacity)}`)
        if (!Number.isNaN(price) && !Number.isNaN(capacity))
          sorted = insertion(sorted, company, lane, { price: priceValue, capacity: capacityValue } as item)
        else throw `cell(${i}, ${j}) has price "${price}" and capacity "${capacity}". One of which is "Not A Number".`
      } else console.log(`Acceptable null value found in cell(${i}, ${j}). skipping ..`)
    }
  }

  return sorted
}

/**
 * CSV Reader for tables. Raw can be prices.csv / capacity.csv
 * AKA: value is not specific
 * @param raw 
 */
export function csvToRowData(raw: string): rowData[] {
  let rawRows = raw.split("\n")

  var headers = rawRows[0].split(",")
  headers.shift()
  for (let i=0; i<headers.length; i++) { headers[i] = removeQuotes(headers[i])}
  console.log(headers)

  let rows = [] as rowData[]
  for (let i=1; i<rawRows.length; i++) {
    let rowdata = rawRows[i].split(",")
    let data = {
      lane: removeQuotes(rowdata[0]),
      companies: {} as {[company: string]: string}
    }

    for (let j=1; j<rowdata.length; j++) {
      let company = removeQuotes(headers[j-1])
      data.companies[company] = removeQuotes(rowdata[j])
    }

    rows.push(data)
  }

  return rows
}

const removeQuotes = (cell: string): string => {
  if (cell[0] === '"' && cell[cell.length-1] === '"') return cell.slice(1, -1)
  else return cell
}

const insertion = (sorted: data[], company: string, lane: string, item: item): data[] => {
  if (item.capacity === 0) { return sorted }
  if (sorted.length === 0) {
    return [{ company, lane, price: item.price, capacity: item.capacity }] as data[]
  } else if (sorted.length === 1) {
    if (sorted[0].price > item.price) {
      return [{ company, lane, price: item.price, capacity: item.capacity }, sorted[0]]
    } else {
      return [sorted[0], { company, lane, price: item.price, capacity: item.capacity }]
    }
  } else {
    let split = Math.floor(sorted.length / 2)
    let s1 = sorted.slice(0, split)
    let s2 = sorted.slice(split, sorted.length)

    if (s1[s1.length-1].price > item.price) // put it inside s1
      return [...insertion(s1, company, lane, item), ...s2]
    else if (s2[0].price < item.price)
      return [...s1, ...insertion(s2, company, lane, item)]
    else
      return [...s1, { company, lane, price: item.price, capacity: item.capacity }, ...s2]
  }
}