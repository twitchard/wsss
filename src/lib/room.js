const crypto = require('crypto')

function generateUnique () {
    return crypto.randomBytes(16).toString('hex')
}

const rooms = {}
class Room {
    constructor (name) {
        this.name      = name
        this.listeners = {}
        this.state     = {}
        this.version   = generateUnique()
    }

    register () {
        rooms[this.name] = this
    }

    addListener (id, ws) {
        this.listeners[id] = ws
    }

    update (state) {
        this.state = state
        this.version = generateUnique()
    }

    show () {
        return JSON.stringify({ 
            name: this.name,
            state: this.state,
            version: this.version
        })
    }

    emitUpdate () {
        const msg = this.show()
        Object.values(this.listeners).forEach((listener) => {
            listener.send(msg)
        })
    }
}

Room.findByName = function (name) {
    return rooms[name]
}

Room.create = function (name) {
    const room = new Room(name)
    room.register()
    return room
}
