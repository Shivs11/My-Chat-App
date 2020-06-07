const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

// Connecting to a database.

const mongoose = require('mongoose')
const validator = require('validator')
const userinfo = require('./models/email')


mongoose.connect('mongodb://127.0.0.1:27017/chat-app', {
    useNewUrlParser: true,
    useCreateIndex: true
})


const app = express()
const server = http.createServer(app)

const io = socketio(server)

const port = process.env.PORT || 3000

const publicdirectorypath = path.join(__dirname, '../public')

app.use(express.static(publicdirectorypath))



io.on('connection', (socket) => {

    socket.on('receivename', ({name, email}) => {
       
        // Storing the users who can join in a database.
        const newone = new userinfo({
            name,
            email,
            Loggedin: new Date()
        })

        newone.save()
        .then((doc) => {
            console.log(doc)
        })
        .catch(err => {
            console.log(err)
        })

        io.emit('sendmessage', `${name} has joined the chat.`)


    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('sendmessage','A user has left.')
    })

    socket.on('getlocation', (position) => {
        socket.emit('receivelocation', `http://www.google.com/maps/place/${position.latitude},${position.longitude}`)
    })


    socket.broadcast.emit('sendmessage', 'A new user has joined people!')

})

app.get('/Login', (req,res) => {
    res.sendFile(path.join(__dirname, '../public/Login.html'))
})


server.listen(port, () => {
    console.log('Server is up!!!')
})