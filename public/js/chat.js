const socket = io()
document.querySelector('#initial-one').addEventListener('submit', (e) =>{
    e.preventDefault()
    console.log("Work man.")
    // Getting the name of the person who just entered his/her name.
    const name = document.getElementById('myname').value
    const email = document.getElementById('myemail').value
    console.log(email)
    socket.emit('receivename', {
        name,
        email
    })
})


socket.on('sendmessage', (message) => {
    console.log(message)
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

        // Let us also change the inner html of the html.
        var location = document.getElementById("mylocation").innerHTML = `Your position right now will be ${position.coords.latitude} latitudes and 
        ${position.coords.longitude} longitudes.`
    })
})


