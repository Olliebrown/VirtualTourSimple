import React from 'react'
import PropTypes from 'prop-types'

import { hotspotContentEditJSONState } from '../../state/globalState.js'
import { useSetRecoilState } from 'recoil'

import { MenuItem, Stack, TextField, IconButton, Collapse, Slider, Box, Tooltip } from '@mui/material'
import {
  DataObject as JSONEditIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material'

import NumberField from '../Utility/NumberField.jsx'

export default function PanoHotspotEdit (params) {
  const { hotspotInfo, onChange, onDelete, enableEdit, onEdit } = params

  const hotspotContentEditInfo = useSetRecoilState(hotspotContentEditJSONState)

  const updateHotspot = newData => {
    if (onChange) {
      onChange({ ...hotspotInfo, ...newData })
    }
  }

  // Show the JSON content in an editor
  const onJSONEdit = () => {
    hotspotContentEditInfo({
      modalOpen: true,
      jsonFilename: `${hotspotInfo?.id}.json`
    })
  }

  return (
    <React.Fragment>
      <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
        <TextField
          label='Title'
          value={hotspotInfo?.title || ''}
          onChange={e => updateHotspot({ title: e.target.value })}
          variant='standard'
        />

        <TextField
          label='ID'
          value={hotspotInfo?.id || ''}
          onChange={e => updateHotspot({ id: e.target.value })}
          variant='standard'
        />

        <Tooltip title='Edit Hotspot Content'>
          <div>
            <IconButton onClick={onJSONEdit} disabled={!hotspotInfo?.id} size='small' sx={{ my: '10px !important' }}>
              <JSONEditIcon fontSize='inherit' />
            </IconButton>
          </div>
        </Tooltip>

        <Tooltip title='Edit Hotspot Details'>
          <IconButton onClick={onEdit} size='small' sx={{ my: '10px !important' }}>
            <EditIcon fontSize='inherit' />
          </IconButton>
        </Tooltip>

        <Tooltip title='Delete Hotspot'>
          <IconButton onClick={onDelete} size='small' sx={{ my: '10px !important' }}>
            <DeleteIcon fontSize='inherit' />
          </IconButton>
        </Tooltip>
      </Stack>

      <Collapse in={enableEdit} collapsedSize='0px'>
        <Box sx={{ py: 2, mb: 2, borderTop: '1px solid grey', borderBottom: '1px  solid grey' }}>
          <Stack direction="row" spacing={2}>
            <Slider
              size="small"
              min={-190}
              max={190}
              step={0.1}
              value={hotspotInfo?.longitude || 0}
              onChange={(e, newVal) => updateHotspot({ longitude: newVal })}
              aria-label="Longitude"
              valueLabelDisplay="auto"
            />
            <NumberField
              aria-label='Longitude'
              value={hotspotInfo?.longitude || 0}
              onChange={newVal => updateHotspot({ longitude: newVal })}
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
              value={hotspotInfo?.latitude ?? 0}
              onChange={(e, newVal) => updateHotspot({ latitude: newVal })}
              aria-label="Latitude"
              valueLabelDisplay="auto"
            />
            <NumberField
              aria-label='Latitude'
              value={hotspotInfo?.latitude ?? 0}
              onChange={newVal => updateHotspot({ latitude: newVal })}
              variant='standard'
              size="small"
              hiddenLabel
              sx={{ width: '15%' }}
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <NumberField
              label='Dist'
              value={hotspotInfo?.radius ?? 0}
              onChange={newVal => updateHotspot({ radius: newVal })}
              variant='standard'
            />

            <NumberField
              label='Scale'
              value={hotspotInfo?.scale ?? 1}
              onChange={newVal => updateHotspot({ scale: newVal })}
              variant='standard'
            />

            <NumberField
              label='Priority'
              value={hotspotInfo?.priority ?? 0}
              onChange={newVal => updateHotspot({ priority: newVal })}
              variant='standard'
            />

            <TextField
              sx={{ width: '35%' }}
              label='Type'
              value={hotspotInfo?.type ?? ''}
              onChange={e => updateHotspot({ type: e.target.value })}
              variant='standard'
              select
            >
              <MenuItem value={'info'}>Info</MenuItem>
              <MenuItem value={'media'}>Media</MenuItem>
              <MenuItem value={'audio'}>Audio</MenuItem>
              <MenuItem value={'placard'}>Placard</MenuItem>
              <MenuItem value={'zoom'}>Zoom</MenuItem>
            </TextField>
          </Stack>
        </Box>
      </Collapse>
    </React.Fragment>
  )
}

PanoHotspotEdit.propTypes = {
  hotspotInfo: PropTypes.shape({
    title: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,

    longitude: PropTypes.number.isRequired,
    latitude: PropTypes.number.isRequired,

    radius: PropTypes.number,
    scale: PropTypes.number,
    type: PropTypes.oneOf(['info', 'media', 'audio', 'placard', 'zoom'])
  }),

  onChange: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onJSONEdit: PropTypes.func,
  enableEdit: PropTypes.bool
}

PanoHotspotEdit.defaultProps = {
  hotspotInfo: null,
  onChange: null,
  onDelete: null,
  onEdit: null,
  onJSONEdit: null,
  enableEdit: false
}
