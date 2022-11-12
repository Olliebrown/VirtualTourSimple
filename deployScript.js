import path from 'path'
import fs from 'fs-extra'

// Destination assets directory
const DEST_ASSETS = path.resolve('./ThermoTourTutor/assets')

// All the destination directories we need to exist
const ALL_DIRS = [
  path.join(DEST_ASSETS, 'css'),
  path.join(DEST_ASSETS, 'js'),
  path.join(DEST_ASSETS, 'panoGeom'),
  path.join(DEST_ASSETS, 'panoData'),
  path.join(DEST_ASSETS, 'panoMedia', 'audio'),
  path.join(DEST_ASSETS, 'panoMedia', 'infoImages'),
  path.join(DEST_ASSETS, 'panoMedia', 'mapImages'),
  path.join(DEST_ASSETS, 'panoMedia', 'panoImages')
]

// Async function for copying files
async function copyFiles () {
  // Ensure destination directories exist
  ALL_DIRS.forEach(destDir => {
    fs.ensureDirSync(destDir, 0o0777)
  })

  try {
    // Copy base bundle
    await fs.copy('public/bundle.css', './ThermoTourTutor/assets/css/virtualTour.css')
    await fs.copy('public/bundle.js', './ThermoTourTutor/assets/js/virtualTour.js')

    // Copy geometry files
    await fs.copy('public/panoGeom', './ThermoTourTutor/assets/panoGeom')

    // Copy pano data
    await fs.copy('public/panoData', './ThermoTourTutor/assets/panoData')

    // Copy pano media
    await fs.copy('public/panoMedia', './ThermoTourTutor/assets/panoMedia')
  } catch (err) {
    console.error('Deployment failed')
    console.error(err)
  }
}

// Start the copy process
copyFiles()
