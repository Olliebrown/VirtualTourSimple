import React from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'

import ErrorFallback from './components/ErrorFallback.jsx'
// import ThreeFiberExample from './ThreeFiberExample.jsx'
import VirtualTour from './VirtualTour.jsx'

let allowMotion = false

// Mount the main app component
const reactRoot = createRoot(document.getElementById('root'))

function doRender () {
  reactRoot.render(
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <VirtualTour isMobile={false} allowMotion={allowMotion} />
    </ErrorBoundary>
  )
}

// Detect gyro capabilities
const onMotion = (e) => {
  window.removeEventListener('devicemotion', onMotion)
  if (e.rotationRate.alpha || e.rotationRate.beta || e.rotationRate.gamma) {
    // Turn on motion, remove this listener, and re-render
    // if (_DEV_) alert('gyro motion detected, enabling')
    allowMotion = true
    doRender()
  } else {
    // if (_DEV_) alert('no gyro motion detected')
    doRender()
  }
}

// Attempt to install motion handler event (to detect gyroscope capabilities)
function installMotionHandler (e) {
  // Clean up
  e.preventDefault()
  document.getElementById('permissionLink').removeEventListener('click', installMotionHandler)

  // if (_DEV_) alert('Installing permission handler')
  // Do we need to request permission?
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    // if (_DEV_) alert('Requesting permission')
    DeviceMotionEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          // if (_DEV_) alert('permission granted')
          window.addEventListener('devicemotion', onMotion)
        }
      })
      .catch(console.error)
  } else {
    // if (_DEV_) alert('Permission not needed')
    window.addEventListener('devicemotion', onMotion)
  }
}

// Install the motion handler after the first touch
document.getElementById('permissionLink').addEventListener('click', installMotionHandler)
