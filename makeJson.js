import fs from 'fs'

function parseArray (label, curObj, value) {
  const match = label.match(/(?<name>.*?)\[(?<index>\d*)\]/)
  if (match) {
    // Initialize the array if needed
    if (!curObj[match.groups.name]) {
      curObj[match.groups.name] = []
    }

    // Was an index specified?
    if (match.groups.index !== '') {
      if (value !== '') {
        curObj[match.groups.name][match.groups.index] = value
      }
    } else {
      if (typeof curObj[match.groups.name][0] === 'object') {
        curObj[match.groups.name][0] = { ...curObj[match.groups.name][0], ...value }
      } else {
        if (value) {
          curObj[match.groups.name].push(value)
        }
      }
    }

    return curObj
  }

  // Not an array
  return null
}

function parseVariable (label, curObj, value) {
  // Recurse through object properties if any
  if (label.includes('.')) {
    const dotIndex = label.indexOf('.')
    const baseLabel = label.substring(0, dotIndex)
    const restLabel = label.substring(dotIndex + 1)

    // Recurse for more nested properties
    value = parseVariable(restLabel, curObj[baseLabel] || {}, value)
    label = baseLabel
  }

  // Handle arrays
  const newObj = parseArray(label, curObj, value)
  if (newObj) {
    return newObj
  } else {
    // Primitive value
    curObj[label] = value
    return curObj
  }
}

const data = fs.readFileSync('panoImagesNew.csv', { encoding: 'utf8' })
const lines = data.split('\r\n')
const headers = lines.shift().split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
headers.shift()

const newJSONdata = {}
lines.forEach(line => {
  // Split CSV line into cells
  const cells = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
  const key = cells[0]
  newJSONdata[key] = {}
  headers.forEach((header, i) => {
    // Parse value to its proper type
    let value = cells[i + 1]
    if (value[0] === '"') {
      value = value.substring(1, value.length - 1)
      value = value.replaceAll('""', '"')
    }

    try {
      // Try twice in case it's JSON inside quotes
      value = JSON.parse(value)
    } catch (err) {}

    // Build object structure
    newJSONdata[key] = parseVariable(header, newJSONdata[key], value)
  })
})

fs.writeFileSync('newData.json', JSON.stringify(newJSONdata, null, 2), { encoding: 'utf8' })
