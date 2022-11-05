import React from 'react'
import PropTypes from 'prop-types'

import Axios from 'axios'

import Editor from 'react-simple-code-editor'

import { highlight, languages } from 'prismjs/components/prism-core'

import 'prismjs/components/prism-json'
import 'prismjs/themes/prism-okaidia.css'

// A reasonable default for when the file is empty
const DEFAULT_DATA = `{
  "name": "",
  "images": [
    { "src": "" }
  ],
  "audio": {
    "src": ""
  }
}`

export default function JSONCodeEditor (props) {
  const { serverPath, filename } = props

  const [code, setCode] = React.useState('{ "state": "loading..." }')
  React.useEffect(() => {
    const retrieveCode = async (fullPath) => {
      try {
        const response = await Axios.get(fullPath, {
          transformResponse: (res) => { return res },
          responseType: 'json',
          validateStatus: (status) => (status >= 200 && status < 500)
        })

        if (!response.data) {
          setCode(DEFAULT_DATA)
        } else {
          setCode(response.data)
        }
      } catch (err) {
        console.error(`Failed to read JSON file ${fullPath}`)
        console.error(err)

        setCode('{ "state": "Failed to load, see console." }')
      }
    }

    retrieveCode(`${serverPath}/${filename}`)
  }, [filename, serverPath])

  // Append line numbers to the output
  const highlightWithLineNumbers = code => {
    return highlight(code, languages.json)
      .split('\n')
      .map(line => `<span class="container_editor_line_number">${line}</span>`)
      .join('\n')
  }

  return (
    <div className="container_editor_area" style={{
      paddingLeft: '50px',
      backgroundColor: '#272822',
      borderRadius: '5px'
    }}>
      <Editor.default
        value={code}
        onValueChange={code => setCode(code)}
        highlight={highlightWithLineNumbers}
        className='container_editor'
        padding={10}
        style={{
          fontVariantLigatures: 'common-ligatures',
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 14,
          caretColor: '#FFFFFF',
          counterReset: 'line',
          overflow: 'visible'
        }}
      />
    </div>
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
