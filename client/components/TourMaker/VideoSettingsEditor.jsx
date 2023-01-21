import React from 'react'
import PropTypes from 'prop-types'

import { Stack, TextField, FormGroup, FormControlLabel, Switch } from '@mui/material'

import NumberField from '../Utility/NumberField.jsx'
import { NO_CROP } from '../CorePano/videoDataHooks.js'

// Default green-screen value from original shader
const defaultColor = { r: 0.157, g: 0.576, b: 0.129 }
const defaultWeights = { r: 4, g: 1, b: 2 }

export default function VideoSettingsEditor (props) {
  const { video, updateVideo } = props

  const onVideoChange = (newData) => {
    updateVideo(newData)
  }

  const onCropChange = (newData) => {
    onVideoChange({ crop: { ...video.crop, ...newData } })
  }

  const onColorChange = (newData) => {
    updateVideo({ chromaKeyColor: { ...video.chromaKeyColor, ...newData } })
  }

  const onWeightsChange = (newData) => {
    updateVideo({ chromaKeyWeights: { ...video.chromaKeyWeights, ...newData } })
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
            control={<Switch checked={video.autoPlay ?? false} onChange={(e, checked) => onVideoChange({ autoPlay: checked })}/>}
            label="Auto Play"
          />
        </FormGroup>

        <FormGroup>
          <FormControlLabel
            control={<Switch checked={video.loop ?? false} onChange={(e, checked) => onVideoChange({ loop: checked })} />}
            label="Loop"
          />
        </FormGroup>
      </Stack>

      <Stack direction="row" spacing={2}>
        <NumberField
          label='X'
          aria-label='Crop X'
          value={video.crop?.x ?? 0}
          onChange={newVal => onCropChange({ x: newVal })}
          variant='standard'
          size="small"
          precision={3}
          sx={{ width: '45%' }}
        />
        <NumberField
          label='Y'
          aria-label='Crop Y'
          value={video.crop?.y ?? 0}
          onChange={newVal => onCropChange({ y: newVal })}
          variant='standard'
          size="small"
          precision={3}
          sx={{ width: '45%' }}
        />
        <NumberField
          label='Width'
          aria-label='Crop Width'
          value={video.crop?.width ?? 0}
          onChange={newVal => onCropChange({ width: newVal })}
          variant='standard'
          size="small"
          precision={3}
          sx={{ width: '45%' }}
        />
        <NumberField
          label='Height'
          aria-label='Crop Height'
          value={video.crop?.height ?? 0}
          onChange={newVal => onCropChange({ height: newVal })}
          variant='standard'
          size="small"
          sx={{ width: '45%' }}
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <NumberField
          label='Chroma Color R'
          aria-label='Chroma Color R'
          value={video.chromaKeyColor?.r ?? 0}
          onChange={newVal => onColorChange({ r: newVal })}
          variant='standard'
          size="small"
          precision={3}
        />
        <NumberField
          label='Chroma Color G'
          aria-label='Chroma Color G'
          value={video.chromaKeyColor?.g ?? 0}
          onChange={newVal => onColorChange({ g: newVal })}
          variant='standard'
          size="small"
          precision={3}
        />
        <NumberField
          label='Chroma Color B'
          aria-label='Chroma Color B'
          value={video.chromaKeyColor?.b ?? 0}
          onChange={newVal => onColorChange({ b: newVal })}
          variant='standard'
          size="small"
          precision={3}
        />
      </Stack>

      <Stack direction="row" spacing={2}>
        <NumberField
          label='Chroma Weight H'
          aria-label='Chroma Weight H'
          value={video.chromaKeyWeights?.r ?? 0}
          onChange={newVal => onWeightsChange({ r: newVal })}
          variant='standard'
          size="small"
          precision={3}
        />
        <NumberField
          label='Chroma Weight S'
          aria-label='Chroma Weight S'
          value={video.chromaKeyWeights?.g ?? 0}
          onChange={newVal => onWeightsChange({ g: newVal })}
          variant='standard'
          size="small"
          precision={3}
        />
        <NumberField
          label='Chroma Weight V'
          aria-label='Chroma Weight V'
          value={video.chromaKeyWeights?.b ?? 0}
          onChange={newVal => onWeightsChange({ b: newVal })}
          variant='standard'
          size="small"
          precision={3}
        />
      </Stack>
    </Stack>
  )
}

const boxShape = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
}

const colorShape = {
  r: PropTypes.number.isRequired,
  g: PropTypes.number.isRequired,
  b: PropTypes.number.isRequired
}

VideoSettingsEditor.propTypes = {
  video: PropTypes.shape({
    href: PropTypes.string,
    autoPlay: PropTypes.bool,
    loop: PropTypes.bool,
    chromaKeyColor: PropTypes.shape(colorShape),
    chromaKeyWeights: PropTypes.shape(colorShape),
    crop: PropTypes.shape(boxShape)
  }),
  updateVideo: PropTypes.func.isRequired
}

VideoSettingsEditor.defaultProps = {
  video: {
    href: '',
    autoPlay: false,
    loop: false,
    crop: NO_CROP,
    chromaKeyColor: defaultColor,
    chromaKeyWeights: defaultWeights
  }
}
