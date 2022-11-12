
// Asset folder prefix used only in deploy mode
const PREFIX = _DEPLOY_ ? '../assets/' : ''

// Useful global settings
export default Object.freeze({
  // Key of first image to load
  START_KEY: '1S01_22',

  // Time (in ms) to wait to show the interface
  FADE_TIMEOUT: 500,

  // Path to images on dev server
  PANO_IMAGE_PATH: PREFIX + 'panoMedia/panoImages',

  // Path to map image files
  MAP_IMAGE_PATH: PREFIX + 'panoMedia/mapImages',

  // Path to image files for info hotspots
  INFO_IMAGE_PATH: PREFIX + 'panoMedia/infoImages',

  // Path to image files for info hotspots
  INFO_AUDIO_PATH: PREFIX + 'panoMedia/audio',

  // Path to geometry files
  GEOMETRY_FILE_PATH: PREFIX + 'panoGeom',

  // Path to hotspot info JSON files
  HOTSPOT_INFO_PATH: PREFIX + 'panoData',

  // Turn on live data editing
  ENABLE_DATA_EDITING: _DEV_,

  // Enable these in dev mode
  ENABLE_ROTATE_HOTKEYS: _DEV_,
  ENABLE_INDEX_ADVANCING_HOTKEYS: _DEV_,
  ENABLE_MINIMAP_HOTKEYS: _DEV_,
  ENABLE_ALIGNMENT_GRID: _DEV_
})
