import fs from 'fs'
import Express from 'express'

const router = new Express.Router()

const JSON_DATA_FILE = './client/state/heatingPlantTourInfo.json'

// Read the raw JSON data
function readDataFromJSON () {
  try {
    const rawData = fs.readFileSync(JSON_DATA_FILE, { encoding: 'utf8' })
    const baseData = JSON.parse(rawData)
    return baseData
  } catch (err) {
    console.error('Failed to read base JSON data')
    console.error(err)
    return null
  }
}

// Build lists of reasonable map data vales
function getMapInfoLists () {
  try {
    const baseData = readDataFromJSON()
    if (!baseData) {
      throw new Error('Failed to read base json')
    }

    const mapInfoLists = Object.keys(baseData).map(panoKey => {
      if (!baseData[panoKey].mapInfo) { return null }
      return {
        building: baseData[panoKey].mapInfo.building,
        floor: baseData[panoKey].mapInfo.floor,
        image: baseData[panoKey].mapInfo.image
      }
    }).reduce((prev, mapInfo) => {
      if (!prev.buildings.some(item => item === mapInfo?.building)) {
        prev.buildings.push(mapInfo?.building)
      }

      if (!prev.floors.some(item => item === mapInfo?.floor)) {
        prev.floors.push(mapInfo?.floor)
      }

      if (!prev.images.some(item => item === mapInfo?.image)) {
        prev.images.push(mapInfo?.image)
      }

      return prev
    }, { buildings: [], floors: [], images: [] })
    return mapInfoLists
  } catch (err) {
    console.error('Error building map info lists')
    console.error(err)
    return { buildings: [], floors: [], images: [] }
  }
}

// Parse JSON body if present
router.use(Express.json())

// Return summarized full list
router.get('/', (req, res) => {
  // Try to read the base JSON data
  const baseData = readDataFromJSON()
  if (!baseData) {
    return res.status(500).json({ error: true, message: 'failed to read base JSON data' })
  }

  // Send full data
  res.json(baseData)
})

// Return summarized full list
router.get('/mapInfo', (req, res) => {
  // Try to read the base JSON data
  const baseData = readDataFromJSON()
  if (!baseData) {
    return res.status(500).json({ error: true, message: 'failed to read base JSON data' })
  }

  // Reduce to only label and mapInfo
  const summaryData = {}
  Object.keys(baseData).forEach(panoKey => {
    summaryData[panoKey] = { label: baseData[panoKey].label, mapInfo: baseData[panoKey].mapInfo }
  })

  // Send reduced data
  res.json(summaryData)
})

router.get('/keys', (req, res) => {
  // Try to read the base JSON data
  const baseData = readDataFromJSON()
  if (!baseData) {
    return res.status(500).json({ error: true, message: 'failed to read base JSON data' })
  }

  // Send array of just the keys
  res.json(Object.keys(baseData))
})

// routes for the selection lists
router.get('/buildingNames', (req, res) => {
  const mapInfoLists = getMapInfoLists()
  res.json(mapInfoLists.buildings)
})

router.get('/buildingFloors', (req, res) => {
  const mapInfoLists = getMapInfoLists()
  res.json(mapInfoLists.floors)
})

router.get('/buildingImages', (req, res) => {
  const mapInfoLists = getMapInfoLists()
  res.json(mapInfoLists.images)
})

// Return a specific pano
router.get('/:panoKey', (req, res) => {
  // Try to read the base JSON data
  const baseData = readDataFromJSON()
  if (!baseData) {
    return res.status(500).json({ error: true, message: 'failed to read base JSON data' })
  }

  // Is this a valid pano key?
  if (!baseData[req.params.panoKey]) {
    res.status(404).json({})
  } else {
    // Respond with just the data for that pano
    res.json(baseData[req.params.panoKey])
  }
})

// Update a specific pano
router.put('/:panoKey', (req, res) => {
  // Try to read the base JSON data
  const baseData = readDataFromJSON()
  if (!baseData) {
    return res.status(500).json({ error: true, message: 'failed to read base JSON data' })
  }

  // Merge the old and the new
  const oldData = baseData[req.params.panoKey] || {}
  baseData[req.params.panoKey] = { ...oldData, ...req.body }

  // Try to write out the result
  try {
    fs.writeFileSync('./client/state/heatingPlantTourInfo.json', JSON.stringify(baseData, null, 2), { encoding: 'utf8' })
    res.json({ ok: true })
  } catch (err) {
    console.error('Failed to update JSON file')
    console.error(err)
    res.status(500).json({ error: true, message: 'Failed to write to json' })
  }
})

export default router
