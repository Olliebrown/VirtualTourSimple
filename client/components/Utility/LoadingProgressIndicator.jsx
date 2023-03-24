import CONFIG from '../../config.js'
import React from 'react'

import { CircularProgress, Fade } from '@mui/material'
import { loadingProgressState } from '../../state/globalState.js'
import { useRecoilValue } from 'recoil'

export default function LoadingProgressIndicator (props) {
  // subscribe to changes in global state
  const loadingProgress = useRecoilValue(loadingProgressState)

  // Track delayed fade out
  const [show, setShow] = React.useState(false)
  const [waitingTimeout, setWaitingTimeout] = React.useState(false)

  // Use a timeout to delay the fade out
  React.useEffect(() => {
    if (loadingProgress < 100) {
      setShow(true)
      setWaitingTimeout(null)
      clearTimeout(waitingTimeout)
    } else if (loadingProgress === 100 && !waitingTimeout) {
      setWaitingTimeout(setTimeout(() => {
        setShow(false)
        setWaitingTimeout(null)
      }, CONFIG().LOADING_INDICATOR_TIMEOUT))
    }
  }, [loadingProgress, waitingTimeout])

  return (
    <Fade in={show} sx={{ position: 'absolute', top: 16, left: 16 }}>
      <CircularProgress />
    </Fade>
  )
}
