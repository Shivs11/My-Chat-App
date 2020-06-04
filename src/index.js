const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

// Connecting to a database.

const mongodb = require('mongodb')

// This will give us the neccessary functions to be able to connect to our client efficiently.
const MongoClient = mongodb.MongoClient


const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'my-chat-app'

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
    if(error){
        console.log('Unable to connect man.')
    }

    const db = client.db(databaseName)

    db.collection('userinfo').insertOne({
        name: 'Shivam',
        email: 'shivamasaraf@yahoo.com'
    })
    console.log('connected!')
})





const app = express()
const server = http.createServer(app)

const io = socketio(server)

const port = process.env.PORT || 3000

const publicdirectorypath = path.join(__dirname, '../public')
app.use(express.static(publicdirectorypath))

var mongoose = require('mongoose')

io.on('connection', (socket) => {
    
    socket.on('receivename', (name) => {
        io.emit('sendmessage', `${name} has joined the chat.`)
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('sendmessage','A user has left.')
    })

    socket.on('getlocation', (position) => {
        socket.emit('sendmessage', `http://www.google.com/maps/place/${position.latitude},${position.longitude}`)
    })


    socket.broadcast.emit('sendmessage', 'A new user has joined people!')

})



server.listen(port, () => {
    console.log('Server is up!!!')
})