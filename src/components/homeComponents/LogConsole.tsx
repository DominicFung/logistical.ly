import React, { useEffect } from 'react'
import { makeStyles, createStyles, withStyles, Theme } from '@material-ui/core/styles'
import { Paper } from '@material-ui/core'

import MaximizeIcon from '@material-ui/icons/Maximize';
import MinimizeIcon from '@material-ui/icons/Minimize';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%'
    },
    container: {
      maxHeight: 440,
    },

    logBar: {
      width: "100%",
      height: drawerCloseHeight,
      display: "flex",
      background: "#109e92",
      borderRadius: 0
    },
    logBarTitle: {
      margin: "auto",
      marginLeft: 5,
      fontFamily: "Courier New",
      fontSize: 18,
      fontWeight: 600
    },
    logBarButtons: {
      //paddingTop: 2,
      //paddingBottom: 2,

      paddingRight: 5,
      paddingLeft: 5,

      border: "2px solid #333",
      borderRadius: 3,
      
      transition: theme.transitions.create(["background", "background-color"], {
        duration: theme.transitions.duration.complex,
      }),
      "&:hover": {
        backgroundColor: "#333",
        cursor: "pointer"
      },
    },
    logItem: {
      fontFamily: "Courier New",
      fontSize: 12,
      marginTop: 1, 
      marginBottom: 1
    }
  }),
);

const drawerCloseHeight = 28
const drawerOpenHeight = 300
const scrollbarheight = 0

const logConsoleId = 'log-console-screen'

export interface LogConsoleProps {
  openDrawer: () => void, 
  closeDrawer: () => void
}

export default function LogConsole({ 
  openDrawer, closeDrawer
}: LogConsoleProps) {
  const classes = useStyles()

  const [logs, setLogs] = React.useState<{log: string, level: string}[]>([])
  const [overFlowAdjust, setOverFlowAdjust] = React.useState(0)

  useEffect(() => {
    const listener = (e: any) => {
      logs.push(e.detail)
      setLogs([...logs])

      let el = document.getElementById(logConsoleId)
      if (el && checkOverflow(el)) {
        if ( overFlowAdjust === 0 ) setOverFlowAdjust(scrollbarheight)
      } else {
        if (overFlowAdjust === scrollbarheight) setOverFlowAdjust(0)
      }
    }

    document.body.addEventListener('logistic-log', listener)
    return () => document.body.removeEventListener('logistic-log', listener)
  }, [])

  const checkOverflow = (el: HTMLElement) => {
    var curOverflow = el.style.overflow;

    if ( !curOverflow || curOverflow === "visible" )
        el.style.overflow = "hidden";

    var isOverflowing = el.clientWidth < el.scrollWidth 
        || el.clientHeight < el.scrollHeight;

    el.style.overflow = curOverflow;

    return isOverflowing;
  }

  return (
    <Paper className={classes.root} style={{}}>
      <Paper className={classes.logBar}>
        <span className={classes.logBarTitle}>log console</span>
        <div style={{flexGrow: 1}}/>
        <MinimizeIcon onClick={ closeDrawer } className={classes.logBarButtons}/>
        <MaximizeIcon onClick={ openDrawer } className={classes.logBarButtons} style={{marginRight: 2}}/>
      </Paper>
      <Paper style={{
          height: drawerOpenHeight-drawerCloseHeight-12-overFlowAdjust, 
          overflow: "auto", paddingTop: 12
        }} id={logConsoleId}>
        {logs.length === 0 ?
          <p className={classes.logItem}>Please make a run ...</p>:
        logs.map((item) => {

          let color = "black"
          if (item.level === "ANSWER") color = "green"
          else if (item.level === "WARN") color = "orange"
          else if (item.level === "ERROR") color = "red"

          let fontWeight = 400
          if (item.level === "ANSWER" || item.level === "ERROR") fontWeight = 700

          return <p 
            key={Math.floor(Math.random()*9999999)} className={classes.logItem}
            style={{color, fontWeight}}
          >
            {item.log}
          </p>
        })}
      </Paper>
    </Paper>
  )

}