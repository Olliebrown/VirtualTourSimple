// Static global app configuration
import CONFIG from './config.js'

// React.js v18 basic includes
import React from 'react'
import { createRoot } from 'react-dom/client'

// Installation of recoil state
import { RecoilRoot } from 'recoil'

// Main react elements
import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from './components/Utility/ErrorFallback.jsx'
import VirtualTour from './VirtualTour.jsx'
import Curtain from './components/Utility/Curtain.jsx'

// Helper scripts for detecting motion control capabilities
import { installMotionHandler } from './motionControlsPermission.js'

// Main entry point for attaching the permission events and rendering the tour
export function attachVirtualTour (startingRoom, permissionElement, rootRenderElement, enabledRooms, enabledHotSpots, textColor, backgroundColor) {
  // Sanitize the inputs
  startingRoom = startingRoom || CONFIG.START_KEY
  permissionElement = permissionElement ?? document.getElementById('virtualTourPermission')
  rootRenderElement = rootRenderElement ?? document.getElementById('virtualTourRoot')
  enabledRooms = enabledRooms ?? []
  enabledHotSpots = enabledHotSpots ?? []
  textColor = textColor ?? 'black'
  backgroundColor = backgroundColor ?? 'lightgrey'

  // Initiate the React rendering
  const doRender = (allowMotion) => {
    if (_DEV_) console.log('Rendering the root react element ...')

    // Clean up some CSS in case this is an embedded tour
    rootRenderElement.scrollIntoView(true)
    document.body.style.overflow = 'hidden'

    // Make fullscreen
    rootRenderElement.style.width = '100%'
    rootRenderElement.style.height = '100%'

    // Render the root
    const reactRoot = createRoot(rootRenderElement)
    reactRoot.render(
      <RecoilRoot>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <VirtualTour
            isMobile={false} // TODO: Is this a bug?  Should it be something different?
            allowMotion={allowMotion}
            startingRoom={startingRoom}
            enabledRooms={enabledRooms}
            enabledHotSpots={enabledHotSpots}
            rootElement={rootRenderElement}
            reactRoot={reactRoot}
          />
          <Curtain color={textColor} background={backgroundColor} />
        </ErrorBoundary>
      </RecoilRoot>
    )
  }

  // Setup the permission listener
  permissionElement.addEventListener('click', event => {
    installMotionHandler(doRender, event)
  })
}

// Export to main context for calling from HTML scripts
window.attachVirtualTour = attachVirtualTour
