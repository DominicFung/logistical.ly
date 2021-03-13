import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { AppBar, Toolbar, Typography, IconButton, Button } from '@material-ui/core'


import HomeIcon from '@material-ui/icons/Home'
import SettingsIcon from '@material-ui/icons/Settings'
import InfoIcon from '@material-ui/icons/Info'

import EditIcon from '@material-ui/icons/Edit'


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    grow: {
      flexGrow: 1,
    },
    button: {
      margin: theme.spacing(1),
      textTransform: "none"
    },
  }),
);

export interface DenseAppBarProps {
  page: String,
  goToHome: () => void
  goToCapacity: () => void
  goToSettings: () => void
  goToAbout: () => void

  showPrice: boolean
  showCapacity: boolean
}

export default function DenseAppBar({
    page, goToHome, goToCapacity, goToSettings, goToAbout,
    showPrice, showCapacity
}: DenseAppBarProps) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton edge="start" className={classes.menuButton} 
            color="inherit" aria-label="menu" onClick={ goToHome }
          >
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" style={{fontFamily: "FedokaOne"}}>
            Logistical.ly <small style={{fontSize: 10, fontFamily: "Roboto"}}>by Dom</small>
          </Typography>
          <div className={classes.grow} />

          <Button
            variant="outlined"
            color="secondary"
            size="small"
            className={classes.button}
            startIcon={<EditIcon />}
            onClick={ goToCapacity }
            disabled={!showCapacity}
          >
            Capacity
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            className={classes.button}
            startIcon={<EditIcon />}
            disabled={!showPrice}
          >
            Prices
          </Button>

          <div style={{width: 20}} />

          <IconButton aria-label="settings" color="inherit" onClick={goToSettings}>
            <SettingsIcon />
          </IconButton>
          <IconButton aria-label="info" color="inherit" onClick={goToAbout}>
            <InfoIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}