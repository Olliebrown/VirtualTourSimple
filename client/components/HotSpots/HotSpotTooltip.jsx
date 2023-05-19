import * as React from 'react'

import { hotspotModalOpenState, hotspotHoverState } from '../../state/globalState.js'
import { useRecoilValue } from 'recoil'

import { Popper, Fade, Paper, Typography, Card, CardContent } from '@mui/material'

import { useHotspotContent } from '../../state/hotspotInfoHelper.js'

export default function HotSpotTooltip (props) {
  // Subscribe to pieces of global state
  const hotspotModalOpen = useRecoilValue(hotspotModalOpenState)
  const hotspotHover = useRecoilValue(hotspotHoverState)

  // console.log('======= HotSpotTooltip =======')
  // console.log(hotspotHover)

  // Reference for tracking mouse position
  const positionRef = React.useRef({ x: 0, y: 0 })

  // Internal popper reference (used inside Tooltip)
  const popperRef = React.useRef(null)

  // Update along with mouse position
  const handleMouseMove = (event) => {
    positionRef.current = { x: event.clientX + 20, y: event.clientY + 20 }
    popperRef?.current?.update()
  }

  const hotspotContent = useHotspotContent(hotspotHover?.jsonFilename, hotspotHover?.type)

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
  let tooltipTitle = hotspotHover?.title ?? ''
  switch (hotspotHover?.type) {
    case 'info': tooltipTitle = 'Learn about ' + tooltipTitle; break
    case 'zoom': tooltipTitle = 'Zoom in on ' + tooltipTitle; break
    case 'media': tooltipTitle = 'Watch ' + tooltipTitle; break
    case 'audio': tooltipTitle = 'Listen to ' + tooltipTitle; break
    case 'flow': tooltipTitle = 'Show flow for ' + tooltipTitle; break
    default: tooltipTitle = 'Bad Type'; break
  }

  // Is there a description to show?
  const showDescription = (
    typeof hotspotContent?.description === 'string' &&
    hotspotContent?.description?.trim() !== ''
  )

  return (
    <Popper
      popperRef={popperRef}
      open={!!hotspotHover?.hovering && hotspotModalOpen === ''}
      anchorEl={{ getBoundingClientRect }}
      transition
      placement="bottom-start"
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps}>
          {hotspotHover?.type === 'placard'
            ? <Card sx={{ maxWidth: 400, textAlign: 'left' }}>
                <CardContent sx={{ paddingBottom: '16px !important' }}>
                  <Typography
                    variant="h5"
                    component="div"
                    gutterBottom={showDescription}
                    sx={{ borderBottom: showDescription ? '1px solid lightgrey' : undefined }}
                  >
                    {hotspotContent?.title || 'Loading...'}
                  </Typography>
                  {showDescription &&
                    <Typography variant="body2">
                      {hotspotContent?.description || '(please wait)'}
                    </Typography>}
                </CardContent>
              </Card>
            : <Paper>
                <Typography sx={{ p: 2 }}>{tooltipTitle}</Typography>
              </Paper>}
        </Fade>
      )}
    </Popper>
  )
}
