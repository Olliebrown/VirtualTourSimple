import React from 'react'
import PropTypes from 'prop-types'

import { Stack, TextField, FormGroup, FormControlLabel, Switch } from '@mui/material'

import NumberField from '../Utility/NumberField.jsx'
import { NO_CROP } from '../CorePano/videoDataHooks.js'

export default function VideoSettingsEditor (props) {
  const { video, updateVideo } = props

  const onVideoChange = (newData) => {
    updateVideo({ ...video, ...newData })
  }

  const onCropChange = (newData) => {
    onVideoChange({ crop: { ...video.crop, ...newData } })
  }

  return (
    <Stack spacing={2}>
      <TextField
        label="HREF"
        variant="standard"
        value={video.href}
        onChange={e => onVideoChange({ href: e.target.value })}
        fullWidth
      />

      <Stack direction="row" spacing={2}>
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={video.autoPlay} onChange={(e, checked) => onVideoChange({ autoPlay: checked })}/>}
            label="Auto Play"
          />
        </FormGroup>

        <FormGroup>
          <FormControlLabel
            control={<Switch checked={video.loop} onChange={(e, checked) => onVideoChange({ loop: checked })} />}
            label="Loop"
          />
        </FormGroup>
      </Stack>

      <Stack direction="row" spacing={2}>
        <NumberField
          label='X'
          aria-label='Crop X'
          value={video.crop.x}
          onChange={newVal => onCropChange({ x: newVal })}
          variant='standard'
          size="small"
          sx={{ width: '45%' }}
        />
        <NumberField
          label='Y'
          aria-label='Crop Y'
          value={video.crop.y}
          onChange={newVal => onCropChange({ y: newVal })}
          variant='standard'
          size="small"
          sx={{ width: '45%' }}
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <NumberField
          label='Width'
          aria-label='Crop Width'
          value={video.crop.width}
          onChange={newVal => onCropChange({ width: newVal })}
          variant='standard'
          size="small"
          sx={{ width: '45%' }}
        />
        <NumberField
          label='Height'
          aria-label='Crop Height'
          value={video.crop.height}
          onChange={newVal => onCropChange({ height: newVal })}
          variant='standard'
          size="small"
          sx={{ width: '45%' }}
        />
      </Stack>
    </Stack>
  )
}

VideoSettingsEditor.propTypes = {
  video: PropTypes.shape({
    href: PropTypes.string,
    autoPlay: PropTypes.bool,
    loop: PropTypes.bool,
    crop: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired
    })
  }),
  updateVideo: PropTypes.func.isRequired
}

VideoSettingsEditor.defaultProps = {
  video: {
    href: '',
    autoPlay: false,
    loop: false,
    crop: NO_CROP
  }
}
