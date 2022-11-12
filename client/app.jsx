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

// Helper scripts for detecting motion control capabilities
import { installMotionHandler } from './motionControlsPermission.js'

// Main entry point for attaching the permission events and rendering the tour
export function attachVirtualTour (startingRoom, permissionElement, rootRenderElement) {
  // Sanitize the inputs
  startingRoom = startingRoom || CONFIG.START_KEY
  permissionElement = permissionElement ?? document.getElementById('virtualTourPermission')
  rootRenderElement = rootRenderElement ?? document.getElementById('virtualTourRoot')

  // Initiate the React rendering
  const doRender = (allowMotion) => {
    if (_DEV_) console.log('Rendering the root react element ...')

    // Clean up some CSS in case this is an embedded tour
    rootRenderElement.scrollIntoView(true)
    document.body.style.overflow = 'hidden'

    // Render the root
    const reactRoot = createRoot(rootRenderElement)
    reactRoot.render(
      <RecoilRoot>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <VirtualTour isMobile={false} allowMotion={allowMotion} startingRoom={startingRoom} rootElement={reactRoot} />
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
