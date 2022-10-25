import React from 'react'
import PropTypes from 'prop-types'

import { TextField } from '@mui/material'

export default function NumberField (props) {
  const { minValue, maxValue, value, precision, onChange, ...rest } = props

  // Track allowed characters that parseFloat would remove
  const [hasLeadingPlus, setHasLeadingPlus] = React.useState(false)
  const [hasTrailingDecimal, setHasTrailingDecimal] = React.useState(false)

  // Process an input value
  const parseValueChange = valueStr => {
    // Allow clearing to nothing
    if (valueStr === '') valueStr = '0'

    // Check for leading and trailing characters
    setHasLeadingPlus(valueStr[0] === '+')
    setHasTrailingDecimal(valueStr[valueStr.length - 1] === '.')

    // Truncate to specified precision
    if (!isNaN(parseFloat(valueStr))) {
      valueStr = parseFloat(valueStr).toString().match(RegExp(`^-?\\d+(?:\\.\\d{0,${precision}})?`))[0]
    }

    // Clamp to min and max (if specified)
    if (typeof minValue === 'number') {
      if (parseFloat(valueStr) < minValue) {
        valueStr = minValue.toFixed(precision)
      }
    }

    if (typeof maxValue === 'number') {
      if (parseFloat(valueStr) > maxValue) {
        valueStr = maxValue.toFixed(precision)
      }
    }

    // Pass value out to onChange callback
    if (onChange) { onChange(parseFloat(valueStr)) }
  }

  // Build string value from state
  const strValue = `${hasLeadingPlus ? '+' : ''}${value}${hasTrailingDecimal ? '.' : ''}`

  return (
    <TextField
      inputProps={{
        inputMode: 'numeric',
        pattern: '[+\\-]?[0-9]*(?:\\.[0-9]*)?'
      }}
      value={strValue}
      onChange={e => parseValueChange(e.target.value)}
      {...rest}
    />
  )
}

NumberField.propTypes = {
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  value: PropTypes.number,
  precision: PropTypes.number,
  onChange: PropTypes.func
}

NumberField.defaultProps = {
  value: 0,
  precision: 2,
  onChange: null
}
