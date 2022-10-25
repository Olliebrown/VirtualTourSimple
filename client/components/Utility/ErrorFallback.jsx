import React from 'react'
import PropTypes from 'prop-types'

export default function ErrorFallback ({ error }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      {error.stack &&
        <pre>{error.stack}</pre>}
    </div>
  )
}

ErrorFallback.propTypes = {
  error: PropTypes.objectOf(Error)
}

ErrorFallback.defaultProps = {
  error: new Error('no error provided')
}
