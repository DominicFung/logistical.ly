import React, { useEffect } from 'react'
import clsx from 'clsx'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Grid, Drawer, Container, Typography, Button, Paper } from '@material-ui/core'

import logo from '../img/logo_200x200.png'
import { csvReader } from '../logistics/reader';
import { logistic, logistic2 } from '../logistics/logistic';

import LogConsole from './homeComponents/LogConsole'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    logoBlock: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    heroContent: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
      marginTop: theme.spacing(4),
    },

    drawer: {
      height: drawerCloseHeight,
      flexShrink: 0,
      whiteSpace: 'nowrap'
    },
    drawerOpen: {
      height: drawerOpenHeight,
      transition: theme.transitions.create('height', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('height', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowY: 'hidden',
      height: drawerCloseHeight, //drawerCloseHeight
      [theme.breakpoints.up('sm')]: {
        height: drawerCloseHeight, //drawerCloseHeight
      },
    },

    mainForDrawerOpen: {
      height: `calc(100% - ${drawerOpenHeight}px)`,
      [theme.breakpoints.up('sm')]: {
        height: `calc(100% - ${drawerOpenHeight}px)`, //drawerCloseHeight
      },
      overflowY: 'hidden',
      transition: theme.transitions.create(['height', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    mainForDrawerClose: {
      transition: theme.transitions.create(['height', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowY: 'hidden',
      height: `calc(100% - ${drawerCloseHeight}px)`, //drawerCloseHeight
      [theme.breakpoints.up('sm')]: {
        height: `calc(100% - ${drawerCloseHeight}px)`, //drawerCloseHeight
      },
    }

  }),
);

const _ADJUST = 48
const drawerCloseHeight = 28
const drawerOpenHeight = 300

export interface HomeProps {
  page: String,
  goToSettings: () => void

  price: string
  capacity: string
  maxCap: string
  request: string
}

export default function Home({ 
  page, goToSettings, price, capacity, maxCap, request
}: HomeProps) {
  const classes = useStyles()
  const [height, setHeight] = React.useState(440)
  
  const [minPrice, setMinPrice] = React.useState(0)
  const [openDrawer, setOpenDrawer] = React.useState(false)

  useEffect(() => {
    updateWindowDimensions()
    window.addEventListener('resize', updateWindowDimensions)
    return () => window.removeEventListener('resize', updateWindowDimensions)
  }, [])

  const updateWindowDimensions = () => {
    setHeight(window.innerHeight- _ADJUST)
  }

  const runLogistic = () => {
    if (price && capacity && maxCap && request) {
      setOpenDrawer(true)

      let legend = csvReader(price, capacity)
      let maxCapObj = JSON.parse(maxCap)
      let requestObj = JSON.parse(request)

      let answer2 = logistic2(legend, requestObj, maxCapObj)
      console.log(answer2)

      // RESET
      legend = csvReader(price, capacity)
      maxCapObj = JSON.parse(maxCap)
      requestObj = JSON.parse(request)

      let answer = logistic(legend, requestObj, maxCapObj)
      console.log(answer)

      setMinPrice( answer.minPrice < answer2.minPrice ? answer.minPrice : answer2.minPrice )
    }
  }

  return (
    <div style={{height: height}}>
      <Grid container 
        className={openDrawer?classes.mainForDrawerOpen:classes.mainForDrawerClose}
        style={{
          width:'100%', 
          //height: height-(openDrawer?drawerOpenHeight:drawerCloseHeight), 
          overflowY: "auto"
        }}>
        <Grid item xs={12}>
          <div className={classes.heroContent}>
            <Container maxWidth="sm">
              <div className={classes.logoBlock}>
                <img src={logo} alt="Logistical.ly" style={{width: 200, height: 200}} />
              </div>
              <Typography variant="subtitle1" align="center" color="textSecondary" paragraph>
                Upload a price/capacity table (.csv),<br /> along with company maximum capacity and lane allocations (.json)<br />
                Click "Calculate" to find a solution.
              </Typography>
              <div className={classes.heroButtons}>
                <Grid container spacing={2} justify="center">
                  <Grid item>
                    <Button variant="contained" color="primary" 
                      disabled={price === "" || capacity === "" || maxCap === "" || request === ""}
                      onClick={runLogistic}
                    >
                      Calculate!
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="outlined" color="primary"
                      onClick={goToSettings}
                    >
                      Upload
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </Container>  
          </div>
        </Grid>
      </Grid>
      <Drawer 
        variant="persistent"
        anchor="bottom"
        open={true}
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: openDrawer,
          [classes.drawerClose]: !openDrawer,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: openDrawer,
            [classes.drawerClose]: !openDrawer,
          }),
        }}
      >
        <LogConsole openDrawer={()=>{setOpenDrawer(true)}} closeDrawer={()=>{setOpenDrawer(false)}} />
      </Drawer>
    </div>
  )
}