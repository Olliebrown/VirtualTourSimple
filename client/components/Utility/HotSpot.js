import { TransformData } from './Transform.jsx'

// Different HotSpot types
export const HOTSPOT_TYPES = Object.freeze({
  INFO: 'info',
  MEDIA: 'media',
  AUDIO: 'audio',
  PLACARD: 'placard',
  ZOOM: 'zoom',
  FLOW: 'flow',
  UNKNOWN: 'unknown'
})

// Object for storing HotSpot data
export default class HotSpot {
  constructor ({ title, id, type, modal, longitude, latitude, radius, scale }) {
    // Identifying information
    this.id = id
    this.title = title
    this.type = type

    // Behavior information
    this.modal = modal ?? false

    // Transformation information
    this.transform = new TransformData({ longitude, latitude, radius, scale, isHotSpot: true })
  }

  jsonFilename () {
    return (this.id ? `${this.type}/${this.id}.json` : undefined)
  }

  textureName () {
    switch (this.type) {
      case HOTSPOT_TYPES.INFO:
        return 'InfoIconTexture.png'
      case HOTSPOT_TYPES.MEDIA:
      case HOTSPOT_TYPES.AUDIO:
        return 'MediaIconTexture.png'
      case HOTSPOT_TYPES.PLACARD:
        return 'PlacardIconTexture.png'
      case HOTSPOT_TYPES.ZOOM:
        return 'ZoomIconTexture.png'
      case HOTSPOT_TYPES.FLOW:
        return 'FlowIconTexture.png'
      default:
        return ''
    }
  }
}
