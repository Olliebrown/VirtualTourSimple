import React from 'react'
import PropTypes from 'prop-types'

import { Slider, Stack } from '@mui/material'

import NumberField from '../Utility/NumberField.jsx'

export default function AlignmentEditor (props) {
  const { alignment, updateAlignment } = props

  return (
    <React.Fragment>
      <Stack direction="row" spacing={2}>
        <Slider
          size="small"
          min={-190}
          max={190}
          step={0.1}
          value={alignment[0] || 0}
          onChange={(e, newVal) => updateAlignment(newVal, null, null)}
          aria-label="X Rotation"
          valueLabelDisplay="auto"
        />
        <NumberField
          aria-label='X Rotation'
          value={alignment[0]}
          onChange={newVal => updateAlignment(newVal, null, null)}
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
          value={alignment[1] || 0}
          onChange={(e, newVal) => updateAlignment(null, newVal, null)}
          aria-label="Y Rotation"
          valueLabelDisplay="auto"
        />
        <NumberField
          aria-label='Y Rotation'
          value={alignment[1]}
          onChange={newVal => updateAlignment(null, newVal, null)}
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
          value={alignment[2] || 0}
          onChange={(e, newVal) => updateAlignment(null, null, newVal)}
          aria-label="Z Rotation"
          valueLabelDisplay="auto"
        />
        <NumberField
          aria-label='Z Rotation'
          value={alignment[2]}
          onChange={newVal => updateAlignment(null, null, newVal)}
          variant='standard'
          size="small"
          hiddenLabel
          sx={{ width: '15%' }}
        />
      </Stack>
    </React.Fragment>
  )
}

AlignmentEditor.propTypes = {
  alignment: PropTypes.arrayOf(PropTypes.number).isRequired,
  updateAlignment: PropTypes.func.isRequired
}
