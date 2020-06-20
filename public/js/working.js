// Client side of the application that is resposible for proper texting.

const socket = io()




var usernames = []

 document.querySelector('#chat-form').addEventListener('submit', (e) => {
        e.preventDefault()
        const text  = document.getElementById('msg').value
        document.getElementById('msg').value = ""
        socket.emit('receivetext', text)
 })




 socket.on('displaytext', ({message, time, name, checker}) => {
    // Dynamically adding the texts to our html page.
    // Here, id's are taken into consideration in order to differentiate between multiple clients.
    // The limitation of the app lies in the fact that only two clients are able to join.

    // Creating a new div element.


    const div = document.createElement('div')
    div.classList.add('message')
    if (!name){
        name = "Cannot display your name idek why."
    }
    div.innerHTML = `<p class="meta">${name} <span> ${time}</span></p>
    <p class="text">
        ${message}
    </p>`
    document.querySelector('.chat-messages').appendChild(div)

    // Enabling auto-scrolling in the application.
    var mydocument = document.querySelector('.chat-messages')

    mydocument.scrollTop = mydocument.scrollHeight

})


