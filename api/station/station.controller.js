const stationService = require("./station.service.js")
const logger = require('../../services/logger.service')
const authService = require('../auth/auth.service')

// GET LIST
async function getStations(req, res) {
  try {
    logger.debug('Getting Stations')
    // var queryParams = req.query
    const stations = await stationService.query()
    res.json(stations)
  } catch (err) {
    logger.error('Failed to get stations', err)
    res.status(500).send({ err: 'Failed to get stations' })
  }
}

async function getDemoStations(req, res) {
  try {
    logger.debug('Getting Stations')
    // var queryParams = req.query
    const stations = await stationService.query(true)
    res.json(stations)
  } catch (err) {
    logger.error('Failed to get stations', err)
    res.status(500).send({ err: 'Failed to get stations' })
  }
}

// GET BY ID 
async function getStationById(req, res) {
  try {
    const stationId = req.params.id
    const station = await stationService.getById(stationId)
    res.json(station)
  } catch (err) {
    logger.error('Failed to get station', err)
    res.status(500).send({ err: 'Failed to get station' })
  }
}

// POST (add station)
async function addStation(req, res) {
  try {
    const station = req.body
    const loggedinUser = authService.validateToken(req.cookies.loginToken)

    const addedStation = await stationService.add(station)


    res.json(addedStation)
  } catch (err) {
    logger.error('Failed to add station', err)
    res.status(500).send({ err: 'Failed to add station' })
  }
}

// PUT (Update station)
async function updateStation(req, res) {
  try {
    const station = req.body
    const updatedStation = await stationService.update(station)
    res.json(updatedStation)
  } catch (err) {
    logger.error('Failed to update station', err)
    res.status(500).send({ err: 'Failed to update station' })

  }
}

// DELETE (Remove station)
async function removeStation(req, res) {
  try {
    const stationId = req.params.id
    await stationService.remove(stationId)
    res.send('Removed')
  } catch (err) {
    logger.error('Failed to remove station', err)
    res.status(500).send({ err: 'Failed to remove station' })
  }
}

module.exports = {
  getStations,
  getStationById,
  addStation,
  updateStation,
  removeStation,
  getDemoStations
}


