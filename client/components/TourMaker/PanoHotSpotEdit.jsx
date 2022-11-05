import React from 'react'
import PropTypes from 'prop-types'

import { MenuItem, Stack, TextField, IconButton, Collapse, Slider, Box } from '@mui/material'
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material'

import NumberField from '../Utility/NumberField.jsx'

export default function PanoHotSpotEdit (params) {
  const { hotSpotInfo, onChange, onDelete, enableEdit, onEdit } = params

  const updateHotSpot = newData => {
    if (onChange) {
      console.log(`Old: ${JSON.stringify(hotSpotInfo)}`)
      console.log(`New: ${JSON.stringify(newData)}`)
      onChange({ ...hotSpotInfo, ...newData })
    }
  }

  return (
    <React.Fragment>
      <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
        <TextField
          label='Title'
          value={hotSpotInfo?.title || ''}
          onChange={e => updateHotSpot({ title: e.target.value })}
          variant='standard'
        />

        <TextField
          label='JSON'
          value={hotSpotInfo?.json || ''}
          onChange={e => updateHotSpot({ json: e.target.value })}
          variant='standard'
        />

        <IconButton onClick={onEdit} size='small' sx={{ my: '10px !important' }}>
          <EditIcon fontSize='inherit' />
        </IconButton>

        <IconButton onClick={onDelete} size='small' sx={{ my: '10px !important' }}>
          <DeleteIcon fontSize='inherit' />
        </IconButton>
      </Stack>

      <Collapse in={enableEdit} collapsedSize='0px'>
        <Box sx={{ py: 2, mb: 2, borderTop: '1px solid grey', borderBottom: '1px  solid grey' }}>
          <Stack direction="row" spacing={2}>
            <Slider
              size="small"
              min={-190}
              max={190}
              step={0.1}
              value={hotSpotInfo?.longitude || 0}
              onChange={(e, newVal) => updateHotSpot({ longitude: newVal })}
              aria-label="Longitude"
              valueLabelDisplay="auto"
            />
            <NumberField
              aria-label='Longitude'
              value={hotSpotInfo?.longitude || 0}
              onChange={newVal => updateHotSpot({ longitude: newVal })}
              variant='standard'
              size="small"
              hiddenLabel
              sx={{ width: '15%' }}
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <Slider
              size="small"
              min={-190}
              max={190}
              step={0.1}
              value={hotSpotInfo?.latitude || 0}
              onChange={(e, newVal) => updateHotSpot({ latitude: newVal })}
              aria-label="Latitude"
              valueLabelDisplay="auto"
            />
            <NumberField
              aria-label='Latitude'
              value={hotSpotInfo?.latitude || 0}
              onChange={newVal => updateHotSpot({ latitude: newVal })}
              variant='standard'
              size="small"
              hiddenLabel
              sx={{ width: '15%' }}
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <NumberField
              label='Dist'
              value={hotSpotInfo?.radius || 0}
              onChange={newVal => updateHotSpot({ radius: newVal })}
              variant='standard'
            />

            <NumberField
              label='Scale'
              value={hotSpotInfo?.scale === undefined ? 1 : hotSpotInfo?.scale}
              onChange={newVal => updateHotSpot({ scale: newVal })}
              variant='standard'
            />

            <TextField
              sx={{ width: '35%' }}
              label='Type'
              value={hotSpotInfo?.type || ''}
              onChange={e => updateHotSpot({ type: e.target.value })}
              variant='standard'
              select
            >
              <MenuItem value={'info'}>Info</MenuItem>
              <MenuItem value={'audio'}>Audio</MenuItem>
              <MenuItem value={'video'}>Video</MenuItem>
            </TextField>
          </Stack>
        </Box>
      </Collapse>
    </React.Fragment>
  )
}

PanoHotSpotEdit.propTypes = {
  hotSpotInfo: PropTypes.shape({
    title: PropTypes.string.isRequired,
    json: PropTypes.string.isRequired,

    longitude: PropTypes.number.isRequired,
    latitude: PropTypes.number.isRequired,

    radius: PropTypes.number,
    scale: PropTypes.number,
    type: PropTypes.oneOf(['info', 'audio', 'video'])
  }),

  onChange: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  enableEdit: PropTypes.bool
}

PanoHotSpotEdit.defaultProps = {
  hotSpotInfo: null,
  onChange: null,
  onDelete: null,
  onEdit: null,
  enableEdit: false
}
