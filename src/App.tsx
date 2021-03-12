import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import { MuiThemeProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles'
import { Fade } from '@material-ui/core'

import './App.css'

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

  const goToHome = () => {
    setPage("Home")
  }
  const goToCapacity = () => {
    setPage("Capacity")
  }
  const goToSettings = () => {
    setPage("Settings")
  }
  const goToAbout = () => {
    setPage("About")
  }

  return (
    <MuiThemeProvider theme={mainTheme}>
      <TopBar page={page} goToHome={goToHome} 
        goToCapacity={goToCapacity} goToSettings={goToSettings} goToAbout={goToAbout}
      />
      <div>
        <Fade in={page === "Home"}>
          <div style={{
            visibility: page === "Home"?"visible":"hidden",
            display: page === "Home"?"":"None",
            height: page !== "Home"?0:"auto"
          }}>
            <Home page={page} />
          </div>
        </Fade>
        <Fade in={page === "Capacity"}>
          <div style={{
            visibility: page === "Capacity"?"visible":"hidden",
            display: page === "Capacity"?"":"None",
            height: page !== "Capacity"?0:"auto"
          }}>
            <DenseTable page={page} data={[]} />
          </div>
        </Fade>
        <Fade in={page === "Settings"}>
          <div style={{
            visibility: page === "Settings"?"visible":"hidden",
            display: page === "Settings"?"":"None",
            height: page !== "Settings"?0:"auto"
          }}>
            <Settings page={page} />
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
