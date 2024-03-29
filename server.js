const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')
require("dotenv").config({ path: path.join(__dirname, "./.env") });

const app = express()
const http = require('http').createServer(app)

console.log(process.env.NODE_ENV);

// Express App Config
app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'))

if (process.env.NODE_ENV === 'production') {
    // Express serve static files on production environment
    app.use(express.static(path.resolve(__dirname, 'public')))
} else {
    // Configuring CORS
    const corsOptions = {
        // Make sure origin contains the url your frontend is running on
        origin: ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://127.0.0.1:5173', 'http://localhost:5173'],
        credentials: true
    }
    app.use(cors(corsOptions))
}

const authRoutes = require('./api/auth/auth.routes')
const userRoutes = require('./api/user/user.routes')
const stationRoutes = require('./api/station/station.routes')
const { setupSocketAPI } = require('./services/socket.service')


// routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/station', stationRoutes)
setupSocketAPI(http)

// Make every server-side-route to match the index.html
// so when requesting http://localhost:3030/index.html/toy/123 it will still respond with
// our SPA (single page app) (the index.html file) and allow vue-router to take it from there
app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

const logger = require('./services/logger.service')

const port = process.env.PORT || 3030
http.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})