import * as React from 'react'

import { infoHotspotState } from '../../state/globalState.js'
import { useRecoilValue } from 'recoil'

import { Tooltip } from '@mui/material'
import { Box } from '@mui/system'

export default function HotSpotTooltip (props) {
  // Subscribe to pieces of global state
  const infoHotspot = useRecoilValue(infoHotspotState)

  // Reference for tracking mouse position
  const positionRef = React.useRef({ x: 0, y: 0 })

  // Internal popper reference (used inside Tooltip)
  const popperRef = React.useRef(null)

  // Update along with mouse position
  const handleMouseMove = (event) => {
    positionRef.current = { x: event.clientX, y: event.clientY }
    if (popperRef.current != null) {
      popperRef.current.update()
    }
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

  return (
    <Tooltip
      title={infoHotspot?.title}
      placement="top"
      PopperProps={{
        popperRef,
        anchorEl: (
          infoHotspot?.hovering ? { getBoundingClientRect } : null
        )
      }}
    >
      <Box sx={{ display: 'none' }} />
    </Tooltip>
  )
}
