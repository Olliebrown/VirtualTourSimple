import React from 'react'
import PropTypes from 'prop-types'

import { useRecoilValue } from 'recoil'
import * as state from '../../state/globalState.js'

export default function ErrorFallback ({ error }) {
  const stateValues = []
  for (const stateKey in state) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    stateValues.push(`[${stateKey}] => ${useRecoilValue(state[stateKey])}\n`)
  }

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      {error.stack &&
        <pre>{error.stack}</pre>}
      {state &&
        <>
          <h4>Global State:</h4>
          <pre>{stateValues}</pre>
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
