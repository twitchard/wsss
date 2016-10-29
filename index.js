'use strict'
// External Modules
const WebSocketServer = require('ws').Server

// Internal Libraries
const Room = require('./lib/room')
const Wsss = require('./lib/wsss')

// App bootstrap
const port = process.argv.length > 2 && process.argv[2] || 8000
console.log(`Starting websocket server on port ${port}`)
const wss = new WebSocketServer({port})

Wsss.init(Room, wss)
