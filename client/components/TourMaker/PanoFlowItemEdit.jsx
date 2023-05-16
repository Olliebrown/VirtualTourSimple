import React from 'react'
import PropTypes from 'prop-types'

import { Stack, TextField, IconButton, Collapse, Slider, Box, Tooltip } from '@mui/material'
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  ThreeSixty as AlignIcon,
  Palette as StylingIcon
} from '@mui/icons-material'

import NumberField from '../Utility/NumberField.jsx'
import AlignmentEditor from './AlignmentEditor.jsx'

export default function PanoFlowItemEdit (params) {
  const { flowItemInfo, onChange, onDelete, enableAlign, onAlign, enableEdit, onEdit, enableStyling, onStyling } = params
  const updateFlowItem = newData => {
    if (onChange) {
      onChange({ ...flowItemInfo, ...newData })
    }
  }

  const updateAlignment = (x, y, z) => {
    const newAlignment = [
      isNaN(x) || x === null ? flowItemInfo.alignment?.[0] || 0.0 : x,
      isNaN(y) || y === null ? flowItemInfo.alignment?.[1] || 0.0 : y,
      isNaN(z) || z === null ? flowItemInfo.alignment?.[2] || 0.0 : z
    ]

    if (onChange) {
      onChange({ ...flowItemInfo, alignment: newAlignment })
    }
  }

  return (
    <React.Fragment>
      <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
        <TextField
          label='Title'
          value={flowItemInfo?.text || ''}
          onChange={e => updateFlowItem({ text: e.target.value })}
          variant='standard'
        />

        <TextField
          label='ID'
          value={flowItemInfo?.key || ''}
          onChange={e => updateFlowItem({ key: e.target.value })}
          variant='standard'
        />

        <Tooltip title='Edit Flow Item Details'>
          <IconButton onClick={onEdit} size='small' sx={{ my: '10px !important' }}>
            <EditIcon fontSize='inherit' />
          </IconButton>
        </Tooltip>

        <Tooltip title='Edit Flow Item Styling'>
          <IconButton onClick={onStyling} size='small' sx={{ my: '10px !important' }}>
            <StylingIcon fontSize='inherit' />
          </IconButton>
        </Tooltip>

        <Tooltip title='Edit Flow Item Alignment'>
          <IconButton onClick={onAlign} size='small' sx={{ my: '10px !important' }}>
            <AlignIcon fontSize='inherit' />
          </IconButton>
        </Tooltip>

        <Tooltip title='Delete Flow Item'>
          <IconButton onClick={onDelete} size='small' sx={{ my: '10px !important' }}>
            <DeleteIcon fontSize='inherit' />
          </IconButton>
        </Tooltip>
      </Stack>

      <Collapse in={enableEdit} collapsedSize='0px'>
        <Box sx={{ py: 2, mb: 2, borderTop: '1px solid grey', borderBottom: '1px  solid grey' }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <Slider
                size="small"
                min={-190}
                max={190}
                step={0.1}
                value={flowItemInfo?.longitude || 0}
                onChange={(e, newVal) => updateFlowItem({ longitude: newVal })}
                aria-label="Longitude"
                valueLabelDisplay="auto"
              />
              <NumberField
                aria-label='Longitude'
                value={flowItemInfo?.longitude || 0}
                onChange={newVal => updateFlowItem({ longitude: newVal })}
                variant='standard'
                size="small"
                hiddenLabel
                sx={{ width: '15%' }}
              />
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
              <Slider
                size="small"
                min={-190}
                max={190}
                step={0.1}
                value={flowItemInfo?.latitude ?? 0}
                onChange={(e, newVal) => updateFlowItem({ latitude: newVal })}
                aria-label="Latitude"
                valueLabelDisplay="auto"
              />
              <NumberField
                aria-label='Latitude'
                value={flowItemInfo?.latitude ?? 0}
                onChange={newVal => updateFlowItem({ latitude: newVal })}
                variant='standard'
                size="small"
                hiddenLabel
                sx={{ width: '15%' }}
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              <NumberField
                label='Width'
                value={flowItemInfo?.width ?? 1.0}
                onChange={newVal => updateFlowItem({ width: newVal })}
                variant='standard'
              />
              <NumberField
                label='Height'
                value={flowItemInfo?.height ?? 1.0}
                onChange={newVal => updateFlowItem({ height: newVal })}
                variant='standard'
              />
              <NumberField
                label='Dist'
                value={flowItemInfo?.radius ?? 0}
                onChange={newVal => updateFlowItem({ radius: newVal })}
                variant='standard'
              />
              <NumberField
                label='Scale'
                value={flowItemInfo?.scale ?? 1}
                onChange={newVal => updateFlowItem({ scale: newVal })}
                variant='standard'
              />
            </Stack>
          </Stack>
        </Box>
      </Collapse>

      <Collapse in={enableStyling} collapsedSize='0px'>
        <Box sx={{ py: 2, mb: 2, borderTop: '1px solid grey', borderBottom: '1px  solid grey' }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <TextField
                type='color'
                label='Tint'
                value={flowItemInfo?.color ?? '#ffffff'}
                onChange={e => updateFlowItem({ color: e.target.value })}
                inputProps={{ style: { padding: '8px', height: '2.5em' } }}
                sx={{ minWidth: '110px' }}
              />

              <TextField
                type='color'
                label='Text Color'
                value={flowItemInfo?.textColor ?? '#000000'}
                onChange={e => updateFlowItem({ textColor: e.target.value })}
                inputProps={{ style: { padding: '8px', height: '2.5em' } }}
                sx={{ minWidth: '110px' }}
              />

              <TextField
                type='color'
                label='Outline'
                value={flowItemInfo?.textOutlineColor ?? '#ffffff'}
                onChange={e => updateFlowItem({ textOutlineColor: e.target.value })}
                inputProps={{ style: { padding: '8px', height: '2.5em' } }}
                sx={{ minWidth: '110px' }}
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              <NumberField
                label='Font Size'
                value={flowItemInfo?.fontSize ?? 12}
                onChange={newVal => updateFlowItem({ fontSize: newVal })}
                variant='standard'
              />

              <NumberField
                label='Stroke Size'
                value={flowItemInfo?.outlineSize ?? 0.5}
                onChange={newVal => updateFlowItem({ outlineSize: newVal })}
                variant='standard'
              />

              <NumberField
                label='Horiz Scroll'
                value={flowItemInfo?.animateU ?? 0}
                onChange={newVal => updateFlowItem({ animateU: newVal })}
                variant='standard'
              />

              <NumberField
                label='Vert Scroll'
                value={flowItemInfo?.animateV ?? 0}
                onChange={newVal => updateFlowItem({ animateV: newVal })}
                variant='standard'
              />

            </Stack>
          </Stack>
        </Box>
      </Collapse>

      <Collapse in={enableAlign} collapsedSize='0px'>
        <Box sx={{ py: 2, mb: 2, borderTop: '1px solid grey', borderBottom: '1px  solid grey' }}>
          <AlignmentEditor alignment={flowItemInfo.alignment || [0, 0, 0]} updateAlignment={updateAlignment} />
        </Box>
      </Collapse>

    </React.Fragment>
  )
}

PanoFlowItemEdit.propTypes = {
  flowItemInfo: PropTypes.shape({
    key: PropTypes.string.isRequired,
    alignment: PropTypes.arrayOf(PropTypes.number),
    longitude: PropTypes.number.isRequired,
    latitude: PropTypes.number.isRequired,
    radius: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    scale: PropTypes.number,
    color: PropTypes.string,
    textColor: PropTypes.string,
    text: PropTypes.string,
    fontSize: PropTypes.number,
    animateU: PropTypes.number,
    animateV: PropTypes.number
  }),

  onChange: PropTypes.func,
  onDelete: PropTypes.func,
  onAlign: PropTypes.func,
  enableAlign: PropTypes.bool,
  onEdit: PropTypes.func,
  enableEdit: PropTypes.bool
}

PanoFlowItemEdit.defaultProps = {
  flowItemInfo: null,
  onChange: null,
  onDelete: null,
  onAlign: null,
  enableAlign: false,
  onEdit: null,
  enableEdit: false
}
