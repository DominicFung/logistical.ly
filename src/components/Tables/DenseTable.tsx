import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'

import DenseTableCell from './DenseTableCell'

const useStyles = makeStyles({
  root: {
    width: '100%'
  },
  container: {
    maxHeight: 440,
  },
});

const _ADJUST = 48
export interface DenseTableProps {
  page: string,
  rows: rowData[],
  updateRows: (rows: rowData[]) => void
}

export default function DenseTable({page, rows, updateRows}: DenseTableProps) {
  const classes = useStyles()
  const [height, setHeight] = React.useState(440)
  const [columns, setColumns] = React.useState<string[]>([])

  const [resetKey, setResetKey] = React.useState(1)

  useEffect(() => {
    console.log(rows)
    if (rows.length > 0)
      setColumns(Object.keys(rows[0].companies))
  }, [rows])

  useEffect(() => {
    updateWindowDimensions()
    window.addEventListener('resize', updateWindowDimensions)
    return () => window.removeEventListener('resize', updateWindowDimensions)
  }, [])

  const updateWindowDimensions = () => {
    setHeight(window.innerHeight- _ADJUST)
  }

  const update = (rowIndex: number, company: string, newValue: string ) => {
    rows[rowIndex].companies[company] = newValue
    console.log(rows)
    updateRows(rows)
  }

  return (
    <Paper className={classes.root}>
      { rows.length > 0 ?
      <TableContainer className={classes.container} style={{maxHeight: height}}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>x</TableCell>
              {columns.map((company) => (
                <TableCell key={company}>{company}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => {
              return (
                <TableRow hover tabIndex={1} key={row.lane}>
                  <TableCell>{row.lane}</TableCell>
                  {Object.keys(row.companies).map((value, j) => {
                    return (
                      /*<TableCell key={`${index}-${value}`}>{row.companies[value]}</TableCell>*/
                      <DenseTableCell key={`${value}-${i}-${j}`} 
                        value={row.companies[value]} 
                        setValue={ (newValue) => { update(i, value, newValue) } }
                        resetKey={resetKey}
                        disableAllOtherEdits={() => { setResetKey(resetKey+1) }}
                      />
                    )
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer> : ""}
    </Paper>
  );
}