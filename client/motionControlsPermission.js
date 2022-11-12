// Are we waiting for a motion event?
let waitingForMotion = true

// Pointer to the bound onMotion callback
let boundMotionCallback = null

// Attempt to install motion handler event (to detect gyroscope capabilities)
export function installMotionHandler (doRender, event) {
  // Avoid any default event behavior
  event.preventDefault()

  // Bind callback functions
  boundMotionCallback = onMotion.bind(doRender)

  if (_DEV_) console.log('Installing permission handler')
  // Do we need to request permission?
  if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
    if (_DEV_) console.log('Requesting permission')
    DeviceMotionEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          if (_DEV_) console.log('permission granted')
          window.addEventListener('devicemotion', boundMotionCallback)
          setTimeout(motionTimeout, 500, doRender)
        }
      })
      .catch(console.error)
  } else {
    if (_DEV_) console.log('Permission not needed')
    window.addEventListener('devicemotion', boundMotionCallback)
    setTimeout(motionTimeout, 500, doRender)
  }
}

// Detect gyro capabilities
function onMotion (doRender, event) {
  waitingForMotion = false
  window.removeEventListener('devicemotion', boundMotionCallback)
  if (event.rotationRate.alpha || event.rotationRate.beta || event.rotationRate.gamma) {
    // Turn on motion, remove this listener, and re-render
    if (_DEV_) console.log('gyro motion detected, enabling')
    doRender(true)
  } else {
    if (_DEV_) console.log('no gyro motion detected')
    doRender(false)
  }
}

// Allow timeout while waiting for a motion event
function motionTimeout (doRender) {
  // Stop waiting for a motion event (took too long)
  if (waitingForMotion) {
    console.log('Timed out while waiting for a motion event (assume not supported)')
    waitingForMotion = false
    window.removeEventListener('devicemotion', boundMotionCallback)
    doRender(false)
  }
}
