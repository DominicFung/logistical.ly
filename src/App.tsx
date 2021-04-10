import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import { MuiThemeProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles'
import { Fade } from '@material-ui/core'

import './App.css'
import { csvToRowData } from './logistics/reader'

import TopBar from './components/TopBar'
import Home from './components/Home'
import Settings from './components/Settings'
import About from './components/About'
import DenseTable from './components/Tables/DenseTable'

const mainTheme = createMuiTheme({
  palette: {
    primary: { main: "#33364d" },
    secondary: { main: "#109e92" }
  }
})

function App() {
  const [page, setPage] = useState("Home")

  //const [data, setData] = useState<data[]>([])

  const [price, setPrice] = useState<string>("")
  const [capacity, setCapacity] = useState<string>("")
  const [maxCap, setMaxCap] = useState<string>("")
  const [request, setRequest] = useState<string>("")

  const [priceRows, setPriceRows] = useState<rowData[]>([])
  const [capacityRows, setCapacityRows] = useState<rowData[]>([])

  useEffect(() => {
    console.log("setting price rows ..")
    let tempPrice = csvToRowData(price)
    console.log(tempPrice)
    setPriceRows( tempPrice )
  }, [price])

  useEffect(() => {
    
    setCapacityRows( csvToRowData(capacity) )
  }, [capacity])

  const goToHome = () => { setPage("Home") }
  const goToCapacity = () => { setPage("Capacity") }
  const goToPrices = () => { setPage("Price") }
  const goToSettings = () => { setPage("Settings") }
  const goToAbout = () => { setPage("About") }

  const pushPrice = (s: string) => { setPrice(s) }
  const pushCapacity = (s: string) => { setCapacity(s) }
  const pushMaxCap = (s: string) => { setMaxCap(s) }
  const pushRequest = (s: string) => { setRequest(s) }

  return (
    <MuiThemeProvider theme={mainTheme}>
      <TopBar page={page} goToHome={goToHome} 
        goToCapacity={goToCapacity} goToSettings={goToSettings} goToAbout={goToAbout} goToPrices={goToPrices}

        showPrice={price != ""} showCapacity={capacity != ""}
      />
      <div>
        <Fade in={page === "Home"}>
          <div style={{
            visibility: page === "Home"?"visible":"hidden",
            display: page === "Home"?"":"None",
            height: page !== "Home"?0:"auto"
          }}>
            <Home page={page} goToSettings={goToSettings}
              price={priceRows} capacity={capacityRows} maxCap={maxCap} request={request}
            />
          </div>
        </Fade>
        <Fade in={page === "Capacity"}>
          <div style={{
            visibility: page === "Capacity"?"visible":"hidden",
            display: page === "Capacity"?"":"None",
            height: page !== "Capacity"?0:"auto"
          }}>
            <DenseTable page={"Capacity"} rows={capacityRows} updateRows={ (rows) => { setCapacityRows([...rows]) } }/>
          </div>
        </Fade>
        <Fade in={page === "Price"}>
          <div style={{
            visibility: page === "Price"?"visible":"hidden",
            display: page === "Price"?"":"None",
            height: page !== "Price"?0:"auto"
          }}>
            <DenseTable page={"Price"} rows={priceRows} updateRows={ (rows) => { setPriceRows([...rows]) } } />
          </div>
        </Fade>
        <Fade in={page === "Settings"}>
          <div style={{
            visibility: page === "Settings"?"visible":"hidden",
            display: page === "Settings"?"":"None",
            height: page !== "Settings"?0:"auto"
          }}>
            <Settings page={page} goToHome={goToHome}
              pushPrice={pushPrice} pushCapacity={pushCapacity} 
              pushMaxCap={pushMaxCap} pushRequest={pushRequest}
            />
          </div>
        </Fade>
        <Fade in={page === "About"}>
          <div style={{
            visibility: page === "About"?"visible":"hidden",
            display: page === "About"?"":"None",
            height: page !== "About"?0:"auto"
          }}>
            <About page={page} />
          </div>
        </Fade>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
