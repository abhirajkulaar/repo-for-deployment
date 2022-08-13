const jwt = require("jsonwebtoken")
let myPrivateKey = process.env.myPrivateKey
console.log(myPrivateKey)
function signJWT(data)
{
    return jwt.sign(data, myPrivateKey)
}

function verifyJWT(token)
{
    return jwt.verify(token, myPrivateKey)
}

module.exports = {signJWT, verifyJWT}