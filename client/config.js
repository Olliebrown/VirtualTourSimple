// Useful global settings
export default {
  // Key of first image to load
  START_KEY: '1S01_22',

  // Path to images on dev server
  PANO_IMAGE_PATH: 'media/panoImages',

  // Path to map image files
  MAP_IMAGE_PATH: 'media/mapImages',

  // Path to geometry files
  GEOMETRY_FILE_PATH: 'geom',

  // Path to hotspot info JSON files
  HOTSPOT_INFO_PATH: 'hotspotData',

  // Turn on live data editing
  ENABLE_DATA_EDITING: _DEV_,

  // Enable these in dev mode
  ENABLE_ROTATE_HOTKEYS: _DEV_,
  ENABLE_INDEX_ADVANCING_HOTKEYS: _DEV_,
  ENABLE_MINIMAP_HOTKEYS: _DEV_,
  ENABLE_ALIGNMENT_GRID: _DEV_
}
