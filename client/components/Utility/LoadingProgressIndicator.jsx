import React from 'react'

import { CircularProgress, Fade } from '@mui/material'
import { loadingProgressState } from '../../state/globalState.js'
import { useRecoilValue } from 'recoil'

export default function LoadingProgressIndicator (props) {
  // subscribe to changes in global state
  const loadingProgress = useRecoilValue(loadingProgressState)

  return (
    <Fade in={loadingProgress < 100} sx={{ position: 'absolute', top: 16, left: 16 }}>
      <CircularProgress />
    </Fade>
  )
}
