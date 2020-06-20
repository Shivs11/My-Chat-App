

const socket = io()

// Getting whatever the user enters in our Log in form.

document.getElementById('button_details').addEventListener('click', (e) => {
    e.preventDefault()

    // Getting the name entered by the user.
    const loginname = document.getElementById('username').value
    const userpassword = document.getElementById('mypassword').value
    
    // Sending our credentials to index.js for checking if these values exist in the database

    socket.emit('receivecredentials', {
        name: loginname,
        password: userpassword
    })
})


socket.on('validation', (response) => {
    if(response){
        redirect()
    }
    else{
       failvalidation()
    }
})