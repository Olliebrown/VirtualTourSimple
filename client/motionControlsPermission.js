// Have we requested permission before
let permissionRequested = false

// Is motion supported on this device
let motionSupported = false

// Are we waiting for a motion event?
let waitingForMotion = true

// How long to wait (in ms) for a motion event
const MOTION_WAIT_TIMEOUT = 500

// Wrapper to generate a self-removing event listener
function motionListener (doRender) {
  return function myListener (event) {
    window.removeEventListener('devicemotion', myListener)
    onMotion(doRender, event)
  }
}

// Attempt to install motion handler event (to detect gyroscope capabilities)
export function installMotionHandler (doRender, event) {
  // Avoid any default event behavior
  event?.preventDefault()

  // Do we need to request permission for motion?
  if (permissionRequested) {
    doRender(motionSupported)
  } else {
    if (_DEV_) console.log('Installing permission handler')
    // Do we need to request permission?
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      if (_DEV_) console.log('Requesting permission')
      DeviceMotionEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            if (_DEV_) console.log('permission granted')
            window.addEventListener('devicemotion', motionListener(doRender))
            setTimeout(motionTimeout, MOTION_WAIT_TIMEOUT, doRender)
          }
        })
        .catch(console.error)
    } else {
      if (_DEV_) console.log('Permission not needed')
      window.addEventListener('devicemotion', motionListener(doRender))
      setTimeout(motionTimeout, MOTION_WAIT_TIMEOUT, doRender)
    }
  }
}

// Detect gyro capabilities
function onMotion (doRender, event) {
  if (waitingForMotion) {
    waitingForMotion = false
    if (event?.rotationRate.alpha || event?.rotationRate.beta || event?.rotationRate.gamma) {
      // Turn on motion, remove this listener, and re-render
      if (_DEV_) console.log('gyro motion detected, enabling')
      motionSupported = true

      permissionRequested = true
      doRender(motionSupported)
    } else {
      if (_DEV_) console.log('no gyro motion detected')
      motionSupported = false

      permissionRequested = true
      doRender(motionSupported)
    }
  }
}

// Allow timeout while waiting for a motion event
function motionTimeout (doRender) {
  // Stop waiting for a motion event (took too long)
  if (waitingForMotion) {
    if (_DEV_) console.log('Timed out while waiting for a motion event (assume not supported)')
    waitingForMotion = false
    motionSupported = false

    permissionRequested = true
    doRender(motionSupported)
  }
}
