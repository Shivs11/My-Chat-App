// Client side of the application that is resposible for proper texting.

const socket = io()

const $message1 = document.querySelector('#template_time1')
const $message2 = document.querySelector('#template_time2')
const messagetemplate1 = document.querySelector('#messaging-user1').innerHTML
const messagetemplate2 = document.querySelector('#messaging-user2').innerHTML

var usernames = []

 document.querySelector('#messagesform').addEventListener('submit', (e) => {
        e.preventDefault()
        const text  = document.getElementById('messagenow').value

        socket.emit('receivetext', text)
 })


socket.on('collectname', (name) => {
    usernames.append(name)
    console.log(usernames)
})

 socket.on('displaytext', ({message, time, id}) => {
    // Dynamically adding the texts to our html page.
    // Here, id's are taken into consideration in order to differentiate between multiple clients.
    // The limitation of the app lies in the fact that only two clients are able to join.
    if (!usernames.includes(id)){
        usernames.push(id)
    }
    
    if (id == usernames[0]){

        // First user.
        const html = Mustache.render(messagetemplate1, {
            message,
            time
        })
        $message1.insertAdjacentHTML('beforebegin', html)

    }

    else{
        // Second User.

        const html = Mustache.render(messagetemplate2, {
            message,
            time
        })
        $message2.insertAdjacentHTML('beforebegin', html)

    }


})


