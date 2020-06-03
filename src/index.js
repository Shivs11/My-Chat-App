const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')


const app = express()
const server = http.createServer(app)

const io = socketio(server)

const port = process.env.PORT || 3000

const publicdirectorypath = path.join(__dirname, '../public')
app.use(express.static(publicdirectorypath))



io.on('connection', (socket) => {
    
    socket.on('receivename', (name) => {
        io.emit('sendmessage', `${name} has joined the chat.`)
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('sendmessage', 'A user has left.')
    })


    socket.broadcast.emit('sendmessage', 'A new user has joined people!')

})

server.listen(port, () => {
    console.log('Server is up!!!')
})