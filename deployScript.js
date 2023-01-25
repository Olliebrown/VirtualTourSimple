import path from 'path'
import fs from 'fs-extra'

// Destination assets directory
const DEST_ASSETS = path.resolve('./ThermoTourTutor/assets')

// All the destination directories we need to exist
const ALL_DIRS = [
  path.join(DEST_ASSETS, 'css'),
  path.join(DEST_ASSETS, 'js'),
  path.join(DEST_ASSETS, 'images'),
  path.join(DEST_ASSETS, 'panoGeom'),
  path.join(DEST_ASSETS, 'panoData'),
  path.join(DEST_ASSETS, 'panoMedia', 'audio'),
  path.join(DEST_ASSETS, 'panoMedia', 'infoImages'),
  path.join(DEST_ASSETS, 'panoMedia', 'mapImages'),
  path.join(DEST_ASSETS, 'panoMedia', 'panoImages'),
  path.join(DEST_ASSETS, 'panoMedia', 'panoVideos')
]

// Filter function to leave out certain dirs and their contents
const DO_NOT_COPY = [
  path.join('audio', 'Old'),
  path.join('audio', 'processing'),
  '~WIP'
]
const filter = (src, dest) => {
  return !DO_NOT_COPY.some(badDir => src.includes(badDir))
}

// Async function for copying files
async function copyFiles () {
  // Ensure destination directories exist
  ALL_DIRS.forEach(destDir => {
    fs.ensureDirSync(destDir, 0o0777)
  })

  try {
    // Copy base bundle
    await fs.copy('public/bundle.css', './ThermoTourTutor/assets/css/virtualTour.css', { filter })
    await fs.copy('public/bundle.js', './ThermoTourTutor/assets/js/virtualTour.js', { filter })
    await fs.copy('public/images', './ThermoTourTutor/assets/images', { filter })

    // Copy geometry files
    await fs.copy('public/panoGeom', './ThermoTourTutor/assets/panoGeom', { filter })

    // Copy pano data
    await fs.copy('public/panoData', './ThermoTourTutor/assets/panoData', { filter })

    // Copy pano media
    await fs.copy('public/panoMedia', './ThermoTourTutor/assets/panoMedia', { filter })
  } catch (err) {
    console.error('Deployment failed')
    console.error(err)
  }
}

// Start the copy process
copyFiles()
