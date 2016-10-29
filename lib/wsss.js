'use strict'
const BAD_JSON_ERROR      = 'bad json'
const NO_ID_ERROR         = 'no id'
const NO_ROOM_NAME_ERROR  = 'no room name'
const WRONG_VERSION_ERROR = 'wrong version'

function sendToSocket (socket, err, room) {
    const msg = {}
    if (err) {
        msg.error = err
    }
    if (room) {
        msg.data = room.show()
    }
    console.log('Sending ' + JSON.stringify(msg, null, 2))
    return socket.send(JSON.stringify(msg))
}

function init (Room, wss) {
    wss.on('connection', function (socket) {
        console.log('New connection')
        const send = sendToSocket.bind(null, socket)
        socket.on('message', function (message) {
            console.log('received message ' + message)
            let obj
            try {
                obj = JSON.parse(message)
            } catch (e) {
                return send(BAD_JSON_ERROR)
            }

            if (!obj.id) {
                return send(NO_ID_ERROR)
            }

            if (!obj.roomName) {
                return send(NO_ROOM_NAME_ERROR)
            }

            const id       = obj.id
            const roomName = obj.roomName

            let room = Room.findByName(roomName)

            if (room !== undefined) {
                room.addListener(obj.id, socket)
                if (obj.update && obj.version !== room.version) {
                    return send(WRONG_VERSION_ERROR, room)
                }
            } else {
                room = Room.create(roomName)
                room.addListener(obj.id, socket)
            }
            
            if (obj.update) {
                room.update(obj.update)
                room.emitUpdate()
            }

            send(null, room)
        })
    })
}
exports.init = init
