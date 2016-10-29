#WSSS - Websocket Shared State
Simple websocket server that allows clients to subscribe to updates and arbitrarily update a shared JSON blob.

## Quick start

```
npm install
npm start [PORT_NUMBER] # defaults to 8000
```

## How it works
Client randomly generates an id for itself, and connects to a named 'room' by sending a ws message like:
```
    { "id": "af5ef05ebab5447b71be9"
    , "roomName": "room 101"
    }
```

If the room already exists, then the current state of the room will be sent back to the client. For example
```
    { "name": "room 101"
    , "version": "ec10de375cd3be59"
    , "state": 
      { "arbitrary": "json"
      , "that": ["somebody put here", "previously"]
      }
    }
```

If the room does not exist, it will be created and the state will be initialized to an empty JSON object. For example:

```
    { "name": "room 101"
    , "version": "91efca9fabc35bee"
    , "state": {}
    }
```

To update the state, send your id, the roomName, the current 'version' of the room, and an 'update', a JSON blob to replace the current state.
```
    { "id": "af5ef05ebab5447b71be9"
    , "roomName": "room 101"
    , "version": "91efca9fabc35bee"
    , "update": { "message": "Richard was here" }
    }
```

If the provided version matches the version on the server, a new 'version' will be randomly generated and the new state will be sent to all clients who have connected to the room.

```
    { "name" : "room 101"
    , "version": "cf2e7131ffbac447"
    , "state": { "message": "Richard was here" }
    }

```

If the provided version doesn't match, the state will not be updated and an error will be sent to the client which attempted the update, along with the most up-to-date state/version of the room.

```
{ "error": "wrong version"
, "data": 
  { "name" : "room 101"
  , "version": "70a729dd590bb8b5"
  , "state": { "message": "Griselda was here before Richard. Nya nya."}
  }
}

That's it!
