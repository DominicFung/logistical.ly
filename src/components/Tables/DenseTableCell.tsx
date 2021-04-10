
import React, { useEffect } from 'react'
import { Input, TableCell, TextField } from '@material-ui/core'

export interface DenseTableCellProps {
  value: string,
  setValue: (value: string) => void,

  disableAllOtherEdits: () => void,
  resetKey: number
}

export default function DenseTableCell ({ value, setValue, disableAllOtherEdits, resetKey }: DenseTableCellProps) {
  
  const [isEditMode, setIsEditMode] = React.useState(false)

  useEffect(() => {
    setIsEditMode(false) 
  }, [resetKey])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    console.log(e.key)
    if (e.key == 'Enter' && isEditMode) {
      setIsEditMode(false)
    }
  }
  
  return (
    isEditMode ? 
    <TableCell>
      <TextField value={value} 
        onChange={(e) => { setValue(e.currentTarget.value) }} 
        onKeyPress={handleKeyPress} 
      />
    </TableCell>:
    <TableCell onClick={() => { 
      disableAllOtherEdits()
      setTimeout(() => setIsEditMode(true), 100)
    } 
    }>
      <div style={{width: 166}}>{value}</div>
    </TableCell>
  )
}