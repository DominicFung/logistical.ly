import React, { useEffect } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography, Button } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%'
    },
    container: {
      maxHeight: 440,
    },
  }),
);

interface SettingsItem {
  name: String,
  description: String,
  filePath: String|null,
  dataObject: any
}

const _ADJUST = 48
export interface SettingsProps {
  page: String
}

export default function Settings({ page }: SettingsProps) {
  const classes = useStyles()
  const [height, setHeight] = React.useState(440)

  const [settingsItems, setSettingsItems] = React.useState<SettingsItem[]>([
    {
      name: "Price", 
      description: "Upload a table of prices (.csv) where the companies names make up the column and lane \"names\" make up the rows.",
      filePath: "C:/user/york05/Documents/prices.csv", dataObject: null
    },
    {
      name: "Capacity", 
      description: "Each company and lane has a set capacity. Upload that as a (.csv) file.",
      filePath: null, dataObject: null
    },
    {
      name: "Company Maximum Capacity", 
      description: "Each company has its own maximum capacity. Uplaod that as a (.json) file.",
      filePath: null, dataObject: null
    },
    {
      name: "Request (Lane Allocation)", 
      description: "Our job is to allocate all the lane capacities to the companies at the lowest price possible. Upload this request file as a (.json).",
      filePath: null, dataObject: null
    }
  ] as SettingsItem[])

  useEffect(() => {
    updateWindowDimensions()
    window.addEventListener('resize', updateWindowDimensions)
    return () => window.removeEventListener('resize', updateWindowDimensions)
  }, [])

  const updateWindowDimensions = () => {
    setHeight(window.innerHeight- _ADJUST)
  }

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container} style={{maxHeight: height}}>
        <Table stickyHeader aria-label="sticky table">
          <TableBody>
            {settingsItems.map((item) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1}>
                  <TableCell>
                    <Typography variant="h5" gutterBottom>{item.name}</Typography>
                    <Typography variant="caption" display="block" gutterBottom>{item.description}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" display="block" gutterBottom>
                      {item.filePath? item.filePath : <div style={{width: 300}} />}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" component="label">
                      Upload
                      <input type="file" hidden />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}