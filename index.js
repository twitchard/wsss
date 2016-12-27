'use strict'
// External Modules
const WebSocketServer = require('ws').Server

// Internal Libraries
const Room = require('./lib/room')
const Wsss = require('./lib/wsss')

const noopLogger = {
    info: ()=>{}
}
const stdoutLogger = {
    info: console.log
}
function init (port, logger) {
    logger.info(`Starting websocket server on port ${port}`)
    const wss = new WebSocketServer({port})
    Wsss.init(Room, logger, wss)
}

module.exports = init
if (require.main === module) {
    const port = process.argv.length > 2 && process.argv[2] || 8000
    init(port, stdoutLogger)
}
