import * as React from 'react'

import { infoModalOpenState, hotspotDataState } from '../../state/globalState.js'
import { useRecoilValue } from 'recoil'

import { Popper, Fade, Paper, Typography } from '@mui/material'

export default function HotSpotTooltip (props) {
  // Subscribe to pieces of global state
  const infoModalOpen = useRecoilValue(infoModalOpenState)
  const hotspotData = useRecoilValue(hotspotDataState)

  // Reference for tracking mouse position
  const positionRef = React.useRef({ x: 0, y: 0 })

  // Internal popper reference (used inside Tooltip)
  const popperRef = React.useRef(null)

  // Update along with mouse position
  const handleMouseMove = (event) => {
    positionRef.current = { x: event.clientX + 20, y: event.clientY + 20 }
    popperRef?.current?.update()
  }

  // Install a global event listener to follow the mouse
  // Note: Only runs once on first render
  React.useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  })

  // Just return the position of the mouse
  const getBoundingClientRect = React.useCallback(() => {
    return new DOMRect(
      positionRef.current.x, positionRef.current.y, 0, 0
    )
  }, [positionRef])

  // Construct the tooltip
  let tooltipTitle = hotspotData?.title ?? ''
  switch (hotspotData?.type) {
    case 'info': tooltipTitle = 'Learn about ' + tooltipTitle; break
    case 'media': tooltipTitle = 'Watch ' + tooltipTitle; break
    default: tooltipTitle = 'undefined'; break
  }

  return (
    <Popper
      popperRef={popperRef}
      open={hotspotData?.hovering && !infoModalOpen}
      anchorEl={{ getBoundingClientRect }}
      transition
      placement="bottom-start"
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps}>
          <Paper>
            <Typography sx={{ p: 2 }}>{tooltipTitle}</Typography>
          </Paper>
        </Fade>
      )}
    </Popper>
  )
}
