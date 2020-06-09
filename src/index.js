// My servers.

const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

// Connecting to a database.

const mongoose = require('mongoose')
const validator = require('validator')
const userinfo = require('./models/email')
const bcrypt = require('bcryptjs')

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

    socket.on('receivename', ({name, email, password}) => {
       
        // hashing the password to provide security.

        var salt = bcrypt.genSaltSync(8)
        var hashedone = bcrypt.hashSync(password, salt)

        // Storing the users who can join in a database.
        const newone = new userinfo({
            name,
            email,
            password: hashedone,
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



    // Event to check if the username and the password entered on the login page
    // exists in our database!
    socket.on('receivecredentials', async ({name,password}) => {

        var salt = bcrypt.genSaltSync(8)
        var hashedone = bcrypt.hashSync(password, salt)
        var document = await userinfo.collection.findOne({
            $or:[
                {name: name}
            ]
        })

        bcrypt.compare(password, document.password, function(err,res) {
            if(res){
                socket.emit('validation', true)
            }
            else{
                socket.emit('validation', false)
            }

        })
    })

    // Events for real-time texting.
    socket.on('receivetext',(response) => {
        console.log(response)
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('sendmessage','A user has left.')
    })

    socket.on('getlocation', (position) => {
        socket.emit('receivelocation', `http://www.google.com/maps/place/${position.latitude},${position.longitude}`)
    })


    socket.broadcast.emit('sendmessage', 'A new user has joined people!')

})


// Setting up all my routes here.
app.get('/Login', (req,res) => {
    res.sendFile(path.join(__dirname, '../public/Login.html'))
})

// Route for the main chat-page.
app.get('/chat', (req,res) => {
    res.sendFile(path.join(__dirname, '../public/chatpage.html'))
})


server.listen(port, () => {
    console.log('Server is up!!!')
})