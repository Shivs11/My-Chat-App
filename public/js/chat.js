const socket = io()
document.querySelector('#initial-one').addEventListener('submit', (e) =>{
    e.preventDefault()
    
    const name = e.target.elements.message.value
    socket.emit('receivename', name)
})


socket.on('sendmessage', (message) => {
    console.log(message)
})


