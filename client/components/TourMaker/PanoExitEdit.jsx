import React from 'react'
import PropTypes from 'prop-types'

import { MenuItem, Stack, TextField, IconButton, Collapse, Slider, Box } from '@mui/material'
import { Delete as DeleteIcon, Edit as EditIcon, ThreeSixty as AlignIcon } from '@mui/icons-material'

import NumberField from '../Utility/NumberField.jsx'
import { getDataSubRoute } from '../../state/asyncDataHelper.js'
import AlignmentEditor from './AlignmentEditor.jsx'

export default function PanoExitEdit (params) {
  const { exit, onChange, onDelete, enableEdit, onEdit, enableAlign, onAlign } = params

  const updateExit = newData => {
    if (onChange) { onChange({ ...exit, ...newData }) }
  }

  const updateAlignment = (x, y, z) => {
    const newAlignment = [
      isNaN(x) || x === null ? exit.alignment?.[0] || 0.0 : x,
      isNaN(y) || y === null ? exit.alignment?.[1] || 0.0 : y,
      isNaN(z) || z === null ? exit.alignment?.[2] || 0.0 : z
    ]

    if (onChange) {
      onChange({ ...exit, alignment: newAlignment })
    }
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
    <React.Fragment>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          sx={{ width: '30%' }}
          label='Destination'
          value={destinationOptions.length > 0 ? exit.key : ''}
          onChange={e => updateExit({ key: e.target.value })}
          variant='standard'
          select
        >
          {destinationOptions.sort()}
        </TextField>

        <TextField
          sx={{ width: '35%' }}
          label='Type'
          value={exit?.type || ''}
          onChange={e => updateExit({ type: e.target.value })}
          variant='standard'
          select
        >
          <MenuItem value={'arrow'}>Arrow</MenuItem>
          <MenuItem value={'teleport'}>Teleport</MenuItem>
          <MenuItem value={'door'}>Door</MenuItem>
          <MenuItem value={'stairsUp'}>Stairs Up</MenuItem>
          <MenuItem value={'stairsDown'}>Stairs Down</MenuItem>
        </TextField>

        <IconButton onClick={onEdit} size='small' sx={{ my: '10px !important' }}>
          <EditIcon fontSize='inherit' />
        </IconButton>

        <IconButton onClick={onAlign} size='small' sx={{ my: '10px !important' }}>
          <AlignIcon fontSize='inherit' />
        </IconButton>

        <IconButton onClick={onDelete} size='small' sx={{ my: '10px !important' }}>
          <DeleteIcon fontSize='inherit' />
        </IconButton>
      </Stack>

      <Collapse in={enableEdit} collapsedSize='0px'>
        <Box sx={{ py: 2, mb: 2, borderTop: '1px solid grey', borderBottom: '1px  solid grey' }}>
          <Stack direction="row" spacing={2} >
            <Slider
              size="small"
              min={-190}
              max={190}
              step={0.1}
              value={exit.direction}
              onChange={(e, newVal) => updateExit({ direction: newVal })}
              aria-label="X Rotation"
              valueLabelDisplay="auto"
            />
            <NumberField
              aria-label='X Rotation'
              value={exit.direction}
              onChange={newVal => updateExit({ direction: newVal })}
              variant='standard'
              size="small"
              hiddenLabel
              sx={{ width: '15%' }}
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <NumberField
              label='Dist'
              value={exit.distance}
              onChange={newVal => updateExit({ distance: newVal })}
              variant='standard'
            />

            <NumberField
              label='Height'
              value={exit.height}
              onChange={newVal => updateExit({ height: newVal })}
              variant='standard'
            />

            <NumberField
              label='Shift'
              value={exit.shift}
              onChange={newVal => updateExit({ shift: newVal })}
              variant='standard'
            />
          </Stack>
        </Box>
      </Collapse>

      <Collapse in={enableAlign} collapsedSize='0px'>
        <Box sx={{ py: 2, mb: 2, borderTop: '1px solid grey', borderBottom: '1px  solid grey' }}>
          <AlignmentEditor alignment={exit.alignment || [0, 0, 0]} updateAlignment={updateAlignment} />
        </Box>
      </Collapse>
    </React.Fragment>
  )
}

PanoExitEdit.propTypes = {
  exit: PropTypes.shape({
    key: PropTypes.string.isRequired,
    direction: PropTypes.number.isRequired,
    type: PropTypes.oneOf(['arrow', 'teleport', 'door', 'stairsUp', 'stairsDown']).isRequired
  }).isRequired,
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onAlign: PropTypes.func,
  enableEdit: PropTypes.bool,
  enableAlign: PropTypes.bool
}

PanoExitEdit.defaultProps = {
  onChange: null,
  onDelete: null,
  onEdit: null,
  onAlign: null,
  enableEdit: false,
  enableAlign: false
}
