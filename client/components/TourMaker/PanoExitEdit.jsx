import React from 'react'
import PropTypes from 'prop-types'

import { MenuItem, Stack, TextField, IconButton } from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'

import NumberField from '../Utility/NumberField.jsx'
import { getDataSubRoute } from '../../state/asyncDataHelper.js'

export default function PanoExitEdit (params) {
  const { exit, onChange, onDelete } = params

  const updateExit = newData => {
    if (onChange) { onChange({ ...exit, ...newData }) }
  }

  const [exitKeys, setExitKeys] = React.useState([])
  React.useState(() => {
    const retrieveKeys = async () => {
      const newKeys = await getDataSubRoute('keys', [])
      setExitKeys(newKeys)
    }

    retrieveKeys()
  })

  const destinationOptions = exitKeys.map(key => (<MenuItem key={key} value={key}>{key}</MenuItem>))

  return (
    <Stack direction="row" spacing={2}>
      <TextField
        sx={{ width: '30%' }}
        label='Destination'
        value={destinationOptions.length > 0 ? exit.key : ''}
        onChange={e => updateExit({ key: e.target.value })}
        variant='standard'
        select
      >
        {destinationOptions}
      </TextField>

      <NumberField
        sx={{ width: '20%' }}
        label='Direction'
        value={exit.direction}
        onChange={newVal => updateExit({ direction: newVal })}
        variant='standard'
      />

      <TextField
        sx={{ width: '35%' }}
        label='Type'
        value={exit?.type || ''}
        onChange={e => updateExit({ type: e.target.value })}
        variant='standard'
        select
      >
        <MenuItem value={'arrow'}>Arrow</MenuItem>
        <MenuItem value={'door'}>Door</MenuItem>
        <MenuItem value={'stairsUp'}>Stairs Up</MenuItem>
        <MenuItem value={'stairsDown'}>Stairs Down</MenuItem>
      </TextField>

      <IconButton onClick={onDelete}>
        <DeleteIcon />
      </IconButton>
    </Stack>
  )
}

PanoExitEdit.propTypes = {
  exit: PropTypes.shape({
    key: PropTypes.string.isRequired,
    direction: PropTypes.number.isRequired,
    type: PropTypes.oneOf(['arrow', 'door', 'stairsUp', 'stairsDown']).isRequired
  }).isRequired,
  onChange: PropTypes.func,
  onDelete: PropTypes.func
}
