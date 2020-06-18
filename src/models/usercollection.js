const { compareSync } = require("bcryptjs")

myids = []
myusers = []

function allusers(id,user){
    console.log(id)
    if(!(myids.includes(id))){
        myids.push(id)
        myusers.push(user)
    }


    return myusers

}

function getcurrentuser(id){
    myindex = myids.indexOf(id)
    return myusers[myindex]
}



module.exports = {
    allusers,
    getcurrentuser
}