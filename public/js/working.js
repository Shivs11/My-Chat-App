// Client side of the application that is resposible for proper texting.
const socket = io.connect("http://localhost:3000/")

document.querySelector('#messagesform').addEventListener('submit', (e) => {
    e.preventDefault()
    const text  = document.getElementById('messagenow').value
    socket.emit('receivetext', text)
})