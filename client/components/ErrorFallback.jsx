import React from 'react'
import PropTypes from 'prop-types'

import useStore from '../state/useStore.js'

export default function ErrorFallback ({ error }) {
  const state = useStore(state => state)

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      {error.stack &&
        <pre>{error.stack}</pre>}
      {state &&
        <>
          <h4>Global State:</h4>
          <pre><code lang="json">{JSON.stringify(state, null, 2)}</code></pre>
        </>}
    </div>
  )
}

ErrorFallback.propTypes = {
  error: PropTypes.objectOf(Error)
}

ErrorFallback.defaultProps = {
  error: new Error('no error provided')
}
