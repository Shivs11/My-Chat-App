// Client side of the application that is resposible for proper texting.
const socket = io()

console.log(name)

const $message = document.querySelector('#template_time')
const messagetemplate = document.querySelector('#messaging-template').innerHTML



 document.querySelector('#messagesform').addEventListener('submit', (e) => {
        e.preventDefault()
        const text  = document.getElementById('messagenow').value

        socket.emit('receivetext', text)
 })



 socket.on('displaytext', ({message, time}) => {
    // Dynamically adding the texts to our html page.
    console.log(message)
    const html = Mustache.render(messagetemplate, {
        message,
        time
    })
    $message.insertAdjacentHTML('beforeend', html)
})


