'use strict'
const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const crypto = require('crypto')

let rooms = {}

function generateUnique () {
    return crypto.randomBytes(16).toString('hex')
}

function getRoom (room) {
    if (rooms[room] && rooms[room].version && rooms[room].state) {
        return rooms[room]
    }
    rooms[room] = {
        version: generateUnique(),
        state: {}
    }
}

io.on('connect', function (socket) {
    socket.on('join', function (room) {
        socket.join(room)
        socket.emit('joined', getRoom(room))
        socket.on('update', function (update) {
            if (!update[version]) {
                return socket.emit('error', new Error('Must provide version'))
            }

            if (undefined === update.state) {
                return socket.emit('error', new Error('Must provide state'))
            }

            if (update.version !== rooms[room].version) {
                socket.emit('update', rooms[room])
                return socket.emit('error', new Error('Your version is not up to date.'))
            }

            rooms[room].state = update.state
            rooms[room].version = generateUnique()
            io.to(room).emit('update', rooms[room])
        })
    })
})

app.use(function (req, res, next) {
    if (req.path === '/test') {
        return res.sendFile(__dirname + '/websocket.html')
    }
    return next()
})
app.listen(3000)
