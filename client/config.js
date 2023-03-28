
// Asset folder prefix used only in deploy mode
const DEFAULT_PREFIX = _DEPLOY_ ? '../assets/' : ''

// Updatable media and assets prefix
let PREFIX = DEFAULT_PREFIX
export function updatePrefix (newPrefix) {
  PREFIX = newPrefix + DEFAULT_PREFIX
}

// Generate a config object
export default function config () {
  return {
    // Key of first image to load
    START_KEY: '1S01_22',

    // Time (in ms) to wait to show the interface
    FADE_TIMEOUT: 500,

    // Path to images on dev server
    TEXTURE_IMAGE_PATH: PREFIX + 'images',

    // Time to wait before removing the loading indicator
    LOADING_INDICATOR_TIMEOUT: 1000,

    // Path to images on dev server
    PANO_IMAGE_PATH: PREFIX + 'panoMedia/panoImages',

    // Path to images on dev server
    PANO_VIDEO_PATH: PREFIX + 'panoMedia/panoVideos',

    // Path to map image files
    MAP_IMAGE_PATH: PREFIX + 'panoMedia/mapImages',

    // Path to image files for info hotspots
    INFO_IMAGE_PATH: PREFIX + 'panoMedia/infoImages',

    // Path to image files for zoom hotspots
    ZOOM_IMAGE_PATH: PREFIX + 'panoMedia/zoomImages',

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
  }
}
