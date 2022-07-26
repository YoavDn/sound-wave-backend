const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query(demoStations = false) {
    try {
        let collection
        if (demoStations) collection = await dbService.getCollection('demoStation')
        else collection = await dbService.getCollection('station')

        var stations = await collection.find().toArray()
        return stations
    } catch (err) {
        logger.error('cannot find stations', err)
        throw err
    }
}

async function getById(stationId) {
    try {
        const collection = await dbService.getCollection('station')
        const station = collection.findOne({ _id: ObjectId(stationId) })
        return station
    } catch (err) {
        logger.error(`while finding station ${stationId}`, err)
        throw err
    }
}

async function remove(stationId) {
    try {
        const collection = await dbService.getCollection('station')
        await collection.deleteOne({ _id: ObjectId(stationId) })

        return stationId
    } catch (err) {
        logger.error(`cannot remove station ${stationId}`, err)
        throw err
    }
}

async function add(station) {

    try {
        const collection = await dbService.getCollection('station')
        const addedStation = await collection.insertOne(station)

        return addedStation

    } catch (err) {
        logger.error('cannot insert station', err)
        throw err
    }
}
async function update(station) {
    try {
        var id = ObjectId(station._id)
        delete station._id
        const collection = await dbService.getCollection('station')
        await collection.updateOne({ _id: id }, { $set: { ...station } })
        return station
    } catch (err) {
        logger.error(`cannot update station ${stationId}`, err)
        throw err
    }
}

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
}

function _buildCriteria(filterBy = { query: '' }) {
    const filters = JSON.parse(filterBy.filters)
    const criteria = {}
    const txtCriteria = { $regex: filterBy.query, $options: 'i' }

    if (filterBy.query) criteria.name = txtCriteria
    if (filters.inStock) criteria.inStock = filters.inStock
    if (filters.checkedLabels.length > 0) criteria.labels = { $all: filters.checkedLabels }
    return criteria
}


function _bulidSortCriteria(filterBy = {}) {
    const filters = JSON.parse(filterBy.filters)
    const criteria = {}

    if (filters.sortBy) {
        if (filters.sortBy === 'date') criteria.createdAt = - 1
        if (filters.sortBy === 'name') criteria.name = 1
        if (filters.sortBy === 'price') criteria.price = 1
    }

    return criteria
}


