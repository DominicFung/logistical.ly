import React, { useEffect } from 'react'
import { makeStyles, createStyles, withStyles, Theme } from '@material-ui/core/styles'
import Switch, { SwitchClassKey, SwitchProps } from '@material-ui/core/Switch'
import { 
  Paper, Table, TableBody, TableCell, 
  TableContainer, TableRow, Typography, Button,
  FormControlLabel
} from '@material-ui/core'

import HomeIcon from '@material-ui/icons/Home'

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
  id: string,
  name: string,
  description: string,
  filePath: string|null,
  dataString: string|null,
  type: string
}

const _ADJUST = 48
export interface SettingsProps {
  page: string
  goToHome: () => void

  pushPrice: (s: string) => void
  pushCapacity: (s: string) => void
  pushMaxCap: (s: string) => void
  pushRequest: (s: string) => void
}

export default function Settings({ 
  page, goToHome, 
  pushPrice, pushCapacity,
  pushMaxCap, pushRequest
}: SettingsProps) {
  const classes = useStyles()
  const [height, setHeight] = React.useState(440)
  const [autoHome, setAutoHome] = React.useState(true)

  const [settingsItems, setSettingsItems] = React.useState<SettingsItem[]>([
    {
      id: "price",
      name: "Price", 
      description: "Upload a table of prices (.csv) where the companies names make up the column and lane \"names\" make up the rows.",
      filePath: null, dataString: null, type: ".csv"
    },
    {
      id: "capacity",
      name: "Capacity", 
      description: "Each company and lane has a set capacity. Upload that as a (.csv) file.",
      filePath: null, dataString: null, type: ".csv"
    },
    {
      id: "maxcap",
      name: "Company Maximum Capacity", 
      description: "Each company has its own maximum capacity. Uplaod that as a (.json) file.",
      filePath: null, dataString: null, type: ".json"
    },
    {
      id: "request",
      name: "Request (Lane Allocation)", 
      description: "Our job is to allocate all the lane capacities to the companies at the lowest price possible. Upload this request file as a (.json).",
      filePath: null, dataString: null, type: ".json"
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

  const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    let uploadFiles = (event.target as HTMLInputElement).files
    if (uploadFiles) {
      let file = uploadFiles[0]
      
      let dataString = new Promise<string|null>((resolve) => {
        let reader = new FileReader()
        reader.onload = (e) => { 
          typeof e.target?.result === 'string' || e.target?.result instanceof String ? 
          resolve(e.target?.result as string|null) : resolve(null)
        }
        reader.readAsText(file)
      })
      
      let path = (file as any).path || (file as any).webkitRelativePath || file.name

      console.log(file)
      console.log(`${path} :: ${ await dataString }`)

      settingsItems[index].filePath = path
      if (dataString) settingsItems[index].dataString = await dataString
      else throw("dataString is not of type string.") //TODO: display error to user

      setSettingsItems( [...settingsItems] )
      
      if (settingsItems[index].id === "price" && dataString) pushPrice(await dataString || "") 
      else if (settingsItems[index].id === "capacity" && dataString) pushCapacity(await dataString || "")
      else if (settingsItems[index].id === "maxcap" && dataString) pushMaxCap(await dataString || "")
      else if (settingsItems[index].id === "request" && dataString) pushRequest(await dataString || "")
      else throw(`setingsItems[${index}].id is not a known setting! ${settingsItems[index].id}`) //TODO: display error to user

      let isAllFilled = true
      for (let item of settingsItems) { if (!item.dataString || item.dataString === "") { isAllFilled=false; break} }
      if (autoHome && (isAllFilled) ) { goToHome() }
    } else {
      console.warn("No file uploaded.")
      // TODO: display this error to the user
    }

    event.preventDefault()
  }

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container} style={{maxHeight: height}}>
        <Table stickyHeader aria-label="sticky table">
          <TableBody>
            {settingsItems.map((item, index) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
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
                      <input type="file" hidden onChange={
                        (event: React.ChangeEvent<HTMLInputElement>) => uploadFile(event, index)
                      } accept={item.type}/>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
            <TableRow hover role="checkbox" tabIndex={-1}>
              <TableCell colSpan={2}>
                <Typography variant="h5" gutterBottom>
                  Auto Home <HomeIcon style={{color: "#33364d", verticalAlign: "middle", transform: "translateY(-2px)" }} />
                </Typography>
                <Typography variant="caption" display="block" gutterBottom>
                  Automatically move back to the home page once all files are populated.
                </Typography>
              </TableCell>
              <TableCell>
                <FormControlLabel style={{paddingLeft: 15}}
                  control={
                  <IOSSwitch checked={autoHome} 
                    onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => { setAutoHome(checked) }} 
                    name="checkedB" 
                  />}
                  label=""
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}


// CUSTOM SWITCH
interface Styles extends Partial<Record<SwitchClassKey, string>> {
  focusVisible?: string;
}

interface Props extends SwitchProps {
  classes: Styles;
}

const IOSSwitch = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 42,
      height: 26,
      padding: 0,
      margin: theme.spacing(1),
    },
    switchBase: {
      padding: 1,
      '&$checked': {
        transform: 'translateX(16px)',
        color: theme.palette.common.white,
        '& + $track': {
          backgroundColor: '#109e92', //#52d869
          opacity: 1,
          border: 'none',
        },
      },
      '&$focusVisible $thumb': {
        color: '#109e92', //#52d869
        border: '6px solid #fff',
      },
    },
    thumb: {
      width: 24,
      height: 24,
    },
    track: {
      borderRadius: 26 / 2,
      border: `1px solid ${theme.palette.grey[400]}`,
      backgroundColor: theme.palette.grey[50],
      opacity: 1,
      transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
  }),
)(({ classes, ...props }: Props) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});