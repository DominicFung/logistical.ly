import React, { useEffect } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Grid, Paper, Container, Typography, Button } from '@material-ui/core'

import logo from '../img/logo_200x200.png'

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
  }),
);

const _ADJUST = 48
export interface HomeProps {
  page: String
}

export default function Home({ page }: HomeProps) {
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
                  <Button variant="contained" color="primary">
                    Calculate!
                </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="primary">
                    Upload
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>  
        </div>
      </Grid>
    </Grid>
  )
}