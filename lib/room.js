'use strict'
const crypto = require('crypto')
const _ = require('lodash')

function generateUnique () {
    return crypto.randomBytes(16).toString('hex')
}

const rooms = {}
class Room {
    constructor (name) {
        this.name      = name
        this.listeners = {}
        this.state     = null
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
        return { 
            name: this.name,
            state: this.state,
            version: this.version
        }
    }

    emitUpdate () {
        const msg = {
            data: this.show()
        }
        _.values(this.listeners).forEach((listener) => {
            listener.send(JSON.stringify(msg), function (err) {
                if (err) {
                    console.error('an error occurred ')
                    console.error(err)
                }
            })
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
module.exports = Room
