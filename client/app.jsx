import React from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'

import ErrorFallback from './components/ErrorFallback.jsx'
// import ThreeFiberExample from './ThreeFiberExample.jsx'
import VirtualTour from './VirtualTour.jsx'

// Detect if motion controls are available
let waitingForMotion = true
let allowMotion = false

// Mount the main app component
const reactRoot = createRoot(document.getElementById('root'))
function doRender () {
  console.log('Rendering the root react element ...')
  reactRoot.render(
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <VirtualTour isMobile={false} allowMotion={allowMotion} />
    </ErrorBoundary>
  )
}

// Detect gyro capabilities
const onMotion = (e) => {
  waitingForMotion = false
  window.removeEventListener('devicemotion', onMotion)
  if (e.rotationRate.alpha || e.rotationRate.beta || e.rotationRate.gamma) {
    // Turn on motion, remove this listener, and re-render
    if (_DEV_) console.log('gyro motion detected, enabling')
    allowMotion = true
    doRender()
  } else {
    if (_DEV_) console.log('no gyro motion detected')
    doRender()
  }
}

// Allow timeout while waiting for a motion event
function motionTimeout () {
  // Stop waiting for a motion event (took too long)
  if (waitingForMotion) {
    console.log('Timed out while waiting for a motion event (assume not supported)')
    waitingForMotion = false
    window.removeEventListener('devicemotion', onMotion)
    doRender()
  }
}

// Attempt to install motion handler event (to detect gyroscope capabilities)
function installMotionHandler (e) {
  // Clean up
  e.preventDefault()
  document.getElementById('permissionLink').removeEventListener('click', installMotionHandler)

  if (_DEV_) console.log('Installing permission handler')
  // Do we need to request permission?
  if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
    if (_DEV_) console.log('Requesting permission')
    DeviceMotionEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          if (_DEV_) console.log('permission granted')
          window.addEventListener('devicemotion', onMotion)
          setTimeout(motionTimeout, 500)
        }
      })
      .catch(console.error)
  } else {
    if (_DEV_) console.log('Permission not needed')
    window.addEventListener('devicemotion', onMotion)
    setTimeout(motionTimeout, 500)
  }
}

// Install the motion handler after the first touch
document.getElementById('permissionLink').addEventListener('click', installMotionHandler)
