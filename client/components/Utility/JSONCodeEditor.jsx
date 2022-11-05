import React from 'react'
import PropTypes from 'prop-types'

import { Axios } from 'axios'

import Editor from 'react-simple-code-editor'

import { highlight, languages } from 'prismjs/components/prism-core'

import 'prismjs/components/prism-json'
import 'prismjs/themes/prism.css'

export default function JSONCodeEditor (props) {
  const { serverPath, filename } = props

  const [code, setCode] = React.useState('{ "state": "loading..." }')
  React.useEffect(() => {
    const retrieveCode = async (fullPath) => {
      try {
        const response = await Axios.get(fullPath)
        setCode(response.data)
      } catch (err) {
        console.error(`Failed to read JSON file ${fullPath}`)
        console.error(err)

        setCode('{ "state": "Failed to load, see console." }')
      }
    }

    retrieveCode(`${serverPath}/${filename}`)
  }, [filename, serverPath])

  return (
    <Editor
      value={code}
      onValueChange={code => setCode(code)}
      highlight={code => highlight(code, languages.json)}
      padding={10}
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 12
      }}
    />
  )
}

JSONCodeEditor.propTypes = {
  serverPath: PropTypes.string,
  filename: PropTypes.string
}

JSONCodeEditor.defaultProps = {
  serverPath: '',
  filename: ''
}
