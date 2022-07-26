const express = require('express')

const { login, getLoggedInUser, signup, logout } = require('./auth.controller')

const router = express.Router()

router.get('/', getLoggedInUser)
router.post('/login', login)
router.post('/signup', signup)
router.post('/logout', logout)

module.exports = router