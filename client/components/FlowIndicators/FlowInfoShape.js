import PropTypes from 'prop-types'

export const FlowInfoShape = {
  // Basic id, text, and position
  key: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['arrow', 'label']).isRequired,
  longitude: PropTypes.number.isRequired,
  latitude: PropTypes.number.isRequired,
  text: PropTypes.string,

  // Fine-tuning of position
  alignment: PropTypes.arrayOf(PropTypes.number),
  width: PropTypes.number,
  height: PropTypes.number,
  radius: PropTypes.number,
  scale: PropTypes.number,

  // Appearance Properties
  color: PropTypes.string,
  textColor: PropTypes.string,
  fontSize: PropTypes.number,
  textOutlineColor: PropTypes.string,
  outlineSize: PropTypes.number,

  // Texture/Animation Properties
  animateU: PropTypes.number,
  animateV: PropTypes.number,
  repeatU: PropTypes.number,
  repeatV: PropTypes.number
}

export const FlowInfoDefaults = {
  text: '',

  alignment: [0, 0, 0],
  width: 1,
  height: 1,
  radius: 5,
  scale: 1,

  fontSize: 12,
  color: '#ffffff',
  textColor: '#000000',
  textOutlineColor: '#ffffff',
  outlineSize: 0.5,

  animateU: 0,
  animateV: 0,
  repeatU: 1,
  repeatV: 1
}
