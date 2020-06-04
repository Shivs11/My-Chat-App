const socket = io()
document.querySelector('#initial-one').addEventListener('submit', (e) =>{
    e.preventDefault()
    
    const name = document.getElementById('myname').value
    socket.emit('receivename', name)
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


