'use strict'
// External Modules
const crypto          = require('crypto')
const WebSocketServer = require('ws').Server
const express         = require('express')

// Internal Libraries
const Room        = require('./lib/room')
const RoomSockets = require('./RoomSockets.js')

// App bootstrap
const wss             = new WebSocketServer({port:8080})

RoomSockets.init(Room, wss)
