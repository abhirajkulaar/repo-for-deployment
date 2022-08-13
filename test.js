require('dotenv').config()
const express = require('express')
const app = express()
const { collection, usersCollection} = require("./services/database")
const {signJWT, verifyJWT} = require("./services/jwt")
const productRoutes = require("./products")

var cors = require('cors')
app.use(cors({origin: "http://localhost:3000"}))


app.use(express.json()); //Used to parse JSON bodies


const bcrypt = require('bcrypt');



app.use('/static',express.static('static'))

productRoutes(app);

app.post("/users", async function(req, res){
    let body = req.body
    console.log(body)
    username = body.username;
    password = body.password;
    firstName = body.firstName;
    lastName = body.lastName;

    password = await bcrypt.hash(password, 10)
    // check if username already exists
    await usersCollection.insertOne({'username': username, 'password': password, 'firstName': firstName, 'lastName': lastName});

    res.status(201).json({'success': 'true'})

})

app.post("/login", async function(req, res){
    let body = req.body
    username = body.username;
    password = body.password;

    let userDetails = await usersCollection.findOne({'username': username})
    console.log(userDetails)
    if(userDetails) {

        let token = signJWT(username)
        if(await bcrypt.compare(password, userDetails.password)) {res.status(200).json({"success": true, 'token': token})}
        else{
            res.status(403).json({"success": false})
        }
    }
    else{
        res.status(404).json({"success": false})
    }

})


app.get('/orders', function (req, res)
{
    res.send("List of Orders!")
} )

try{
app.listen(process.env.PORT)
}
catch(e)
{console.log(e)}