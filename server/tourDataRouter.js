import fs from 'fs'
import Express from 'express'

const router = new Express.Router()

const rawData = fs.readFileSync('./client/state/heatingPlantTourInfo.json', { encoding: 'utf8' })
const baseData = JSON.parse(rawData)

// Build lists of reasonable map data vales
const mapInfoLists = Object.keys(baseData).map(panoKey => ({
  building: baseData[panoKey].mapInfo.building,
  floor: baseData[panoKey].mapInfo.floor,
  image: baseData[panoKey].mapInfo.image
})).reduce((prev, mapInfo) => {
  if (!prev.buildings.some(item => item === mapInfo.building)) {
    prev.buildings.push(mapInfo.building)
  }

  if (!prev.floors.some(item => item === mapInfo.floor)) {
    prev.floors.push(mapInfo.floor)
  }

  if (!prev.images.some(item => item === mapInfo.image)) {
    prev.images.push(mapInfo.image)
  }

  return prev
}, { buildings: [], floors: [], images: [] })

// Parse JSON body if present
router.use(Express.json())

// Return summarized full list
router.get('/', (req, res) => {
  // Reduce to only label and mapInfo
  const summaryData = {}
  Object.keys(baseData).forEach(panoKey => {
    summaryData[panoKey] = { label: baseData[panoKey].label, mapInfo: baseData[panoKey].mapInfo }
  })

  // Send reduced data
  res.json(summaryData)
})

router.get('/keys', (req, res) => {
  // Send array of just the keys
  res.json(Object.keys(baseData))
})

// routes for the selection lists
router.get('/buildingNames', (req, res) => {
  res.json(mapInfoLists.buildings)
})

router.get('/buildingFloors', (req, res) => {
  res.json(mapInfoLists.floors)
})

router.get('/buildingImages', (req, res) => {
  res.json(mapInfoLists.images)
})

// Return a specific pano
router.get('/:panoKey', (req, res) => {
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
  const oldData = baseData[req.params.panoKey] || {}
  baseData[req.params.panoKey] = { ...oldData, ...req.body }
  fs.writeFileSync('./client/state/heatingPlantTourInfo.json', JSON.stringify(baseData, null, 2), { encoding: 'utf8' })
  res.json({ ok: true })
})

export default router
