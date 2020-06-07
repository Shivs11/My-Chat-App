const socket = io()
const $messsagesquery = document.querySelector('#template-time')

// Templates.
const messagetemplate = document.querySelector('#messaging-template').innerHTML
const locationtemplate = document.querySelector('#location-template').innerHTML


document.getElementById('button_details').addEventListener('click', (e) =>{
    e.preventDefault()

    // Getting the name of the person who just entered his/her name.
    const name = document.getElementById('myname').value
    const email = document.getElementById('myemail').value
    socket.emit('receivename', {
        name,
        email
    })
})

// Seperate event for receiving and displaying location.

socket.on('receivelocation', (url) => {
    const html = Mustache.render(locationtemplate, {
        url
    })
    $messsagesquery.insertAdjacentHTML('beforeend', html)    
})


socket.on('sendmessage', (message) => {
    console.log(message)
    const html = Mustache.render(messagetemplate, {
        message
    })
    $messsagesquery.insertAdjacentHTML('beforeend', html)
})


document.querySelector('#Location').addEventListener('click', () => {
    if(!navigator.geolocation){
        console.log("This feature ain't supported for you :(")
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('getlocation',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    })
})


