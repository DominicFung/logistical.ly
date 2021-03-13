import React, { useEffect } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Grid, Container, Typography, IconButton } from '@material-ui/core'

import logo from '../img/domlogo_200x200.png'

import LinkedInIcon from '@material-ui/icons/LinkedIn'
import MailIcon from '@material-ui/icons/Mail'

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
      paddingTop: 10,
      paddingBottom: 10,
    },
    heroButtons: {

    },
    heroButtonsIcons: {
      fontSize: 40
    },
  }),
);

const _ADJUST = 48
export interface AboutProps {
  page: String
}

export default function About({ page }: AboutProps) {
  const classes = useStyles()
  const [height, setHeight] = React.useState(440)

  useEffect(() => {
    updateWindowDimensions()
    window.addEventListener('resize', updateWindowDimensions)
    return () => window.removeEventListener('resize', updateWindowDimensions)
  }, [])

  const updateWindowDimensions = () => {
    setHeight(window.innerHeight- _ADJUST)
  }

  return (
    <Grid container style={{width:'100%'}}>
      <Grid item xs={12} className={classes.logoBlock} style={{paddingTop: 20}}>
        <Typography variant="h5" gutterBottom><b style={{color: "black"}}>version</b>: <small>v0.1</small></Typography>
      </Grid>
      <Grid item xs={12}>
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <div className={classes.logoBlock}>
              <img src={logo} alt="Logistical.ly" style={{width: 160, height: 160}} />
            </div>
            <Typography variant="subtitle1" align="center" color="textSecondary" paragraph>
              This app was built using Typescript, React and Electron! <br />
            </Typography>
            <Typography variant="subtitle1" align="center" color="textSecondary" paragraph>
              <b>More about the Developer:</b><br />
              Hi! My name is Dominic Fung (Dom) and I'm a full-stack developer.<br />
              I focus mainly on serverless and cloud technologies (esp. AWS).<br />
              My language of choice is Javascript/Typescript.<br />
            </Typography>
            <div className={classes.logoBlock} style={{paddingTop: 0}}>
              <IconButton className={classes.heroButtons}>
                <LinkedInIcon className={classes.heroButtonsIcons} style={{color: "#2867B2"}}/>
              </IconButton>
              <IconButton className={classes.heroButtons}>
                <MailIcon className={classes.heroButtonsIcons} style={{color: "#e3c12b"}}/>
              </IconButton>
            </div>
          </Container>  
        </div>
      </Grid>
    </Grid>
  )
}