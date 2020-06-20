// My servers.

const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const moment = require('moment')

// Required packages for sending multiple users emails.
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const bunyan = require('bunyan')

const oauth2Client = new OAuth2(
    "606331556934-7i59clh82q6iteia8s947c1sc86k7l3r.apps.googleusercontent.com", // ClientID
    "JOxUhhJf6XArMlmgQeMhKiND", // Client Secret
    "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
    refresh_token: "1//04_Wc0s_ZWXE5CgYIARAAGAQSNwF-L9IrRlK44fPZXG8R7rP5m3q3B8wUpzQVH7PWsGB8rneN3Yb478NfuzyZ5UApsJWZvB9PfjU"
});
const accessToken = oauth2Client.getAccessToken()

const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
         type: "OAuth2",
         user: "shivamasaraf10@gmail.com", 
         clientId: "606331556934-7i59clh82q6iteia8s947c1sc86k7l3r.apps.googleusercontent.com",
         clientSecret: "JOxUhhJf6XArMlmgQeMhKiND",
         refreshToken: "1//04_Wc0s_ZWXE5CgYIARAAGAQSNwF-L9IrRlK44fPZXG8R7rP5m3q3B8wUpzQVH7PWsGB8rneN3Yb478NfuzyZ5UApsJWZvB9PfjU",
         accessToken: accessToken
    }});
    




// Connecting to a database.

const mongoose = require('mongoose')
const validator = require('validator')
const userinfo = require('./models/email')
const bcrypt = require('bcryptjs')
const {allusers, getcurrentuser, giveallusers} = require('./models/usercollection')
const email = require('./models/email')

var myid = 0
var checker = 0


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

var newone = {}
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

            const mailOptions = {
                from: "shivamasaraf10@gmail.com",
                to: `${email}`,
                subject: "Welcome to Chat-Time!",
                generateTextFromHTML: true,
                html: `<b>Hey ${name}!! </b>
                     <br>
                     <br>
                     <br>

                     Welcome to Chat-Time, a real-time chat application developed with an aim to connect with your loved ones during these hard times. Please do keep in mind that this is a work in progress
                     and with that being said, feel free to contact the developer to suggest any further improvements. 
                     Thank You once again for giving this a try! Enjoy your experience!

                     <br>
                     <br>
                     <br>

                     
                     <b>Developer</b>: <i>Shivam Ajay Saraf</i>.
                     <br>
                     <b>Email</b>: <i>shivamasaraf10@gmail.com</i>
                     <br>
                     <b>Phone</b>: <i>+1-647-569-5470</i>
                     <br>`
           };

           smtpTransport.sendMail(mailOptions, (error, response) => {
            error ? console.log(error) : console.log(response);
            smtpTransport.close();
        })
        
        
            io.emit('redirecttologin')
        })
        .catch(err => {
            console.log(err)
        })

        io.emit('sendmessage', `${name} has joined the chat.`)


    })



    // Event to check if the username and the password entered on the login page
    // exists in our database!
    socket.on('receivecredentials', async ({name,password}) => {
        
        // Sending the name to our working client to store it from before.
        var salt = bcrypt.genSaltSync(8)
        var hashedone = bcrypt.hashSync(password, salt)
        var document = await userinfo.collection.findOne({
            $or:[
                {name: name}
            ]
        })


        if(!document){
            socket.emit('validation', false)
        }
        bcrypt.compare(password, document.password, function(err,res) {
            if(res){
                socket.emit('validation', (true, name))
                myid = socket.id
                newone = {name,myid}
            }
            else{
                socket.emit('validation', false)
            }
        })
    })

    // Events for real-time texting

    socket.on('receivetext', (message) => {
        allofthem = allusers(socket.id, newone["name"])
        allmyusers = giveallusers()
        io.emit('displaytext', {
            message,
            time: moment().format("h:mm a"),
            name: getcurrentuser(socket.id),
            allmyusers
        })

        io.emit('displayallusers', allmyusers)
    })

    
    socket.on('getlocation', (position) => {
        socket.emit('receivelocation', `http://www.google.com/maps/place/${position.latitude},${position.longitude}`)
    })


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


