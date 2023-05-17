import React from 'react'
import PropTypes from 'prop-types'

import { TextField } from '@mui/material'

export default function NumberField (props) {
  const { minValue, maxValue, value, precision, onChange, ...rest } = props

  // Track allowed characters that parseFloat would remove
  const [isBlank, setIsBlank] = React.useState(false)
  const [leadingChar, setLeadingChar] = React.useState('')
  const [hasTrailingDecimal, setHasTrailingDecimal] = React.useState(false)

  // Process an input value
  const parseValueChange = valueStr => {
    // Account for blank field
    setIsBlank(valueStr === '' || valueStr === '+' || valueStr === '-')

    // Check for leading and trailing characters
    if (valueStr[0] === '+' || valueStr[0] === '-') {
      setLeadingChar(valueStr[0])
    } else {
      setLeadingChar('')
    }

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
    if (onChange) {
      if (isNaN(parseFloat(valueStr))) {
        onChange(0)
      } else {
        onChange(parseFloat(valueStr))
      }
    }
  }

  // Build string value from state
  const strValue = `${value >= 0 ? leadingChar : ''}${value}${hasTrailingDecimal ? '.' : ''}`

  return (
    <TextField
      inputProps={{
        inputMode: 'numeric',
        pattern: '[\\-\\+]?[0-9]*(?:\\.[0-9]*)?'
      }}
      value={isBlank ? leadingChar : strValue}
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
