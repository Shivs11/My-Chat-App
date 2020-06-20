const socket = io()

const $messsagesquery = document.querySelector('#form-box')

// Templates.
const messagetemplate = document.querySelector('#messaging-template').innerHTML
const locationtemplate = document.querySelector('#location-template').innerHTML


document.getElementById('button_details').addEventListener('click', (e) =>{
    e.preventDefault()

    // Getting the name of the person who just entered his/her name.
    const name = document.getElementById('myname').value
    console.log(name)
    const email = document.getElementById('myemail').value

    //Hashing the password now after getting it and storing it in the database.

    const password = document.getElementById('mypassword').value

    socket.emit('receivename', {
        name,
        email,
        password
    })
})

socket.on('redirecttologin', () => {
    redirect()
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


