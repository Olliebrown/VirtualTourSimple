import React from 'react'
import PropTypes from 'prop-types'

import { loadingCurtainState } from '../../state/globalState.js'
import { useRecoilValue } from 'recoil'

import { Box, Fade, Typography } from '@mui/material'

const COVER_EVERYTHING_STYLE = {
  position: 'absolute',
  top: 0,
  left: 0,
  margin: 0,
  padding: 0,
  width: '100%',
  height: '100%',
  zIndex: 9999
}

export default function Curtain (props) {
  const { color, background } = props
  const loadingCurtain = useRecoilValue(loadingCurtainState)
  return (
    <Fade in={!loadingCurtain.open}>
      <Box sx={{ ...COVER_EVERYTHING_STYLE, lineHeight: '100%', backgroundColor: background }}>
        <Typography variant='h1' sx={{ position: 'relative', top: '50%', transform: 'translate(0, -50%)', color }}>{loadingCurtain.text}</Typography>
      </Box>
    </Fade>
  )
}

Curtain.propTypes = {
  color: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  background: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
}

Curtain.defaultProps = {
  color: 'black',
  background: 'lightgrey'
}
