const {verifyJWT, signJSW} = require("./services/jwt")
const {usersCollection, collection} = require("./services/database")

function productRoutes(app)
{
app.get('/products',async function (req, res) {
    // console.log(req.headers)
     let token = req.headers.auth;
     try{
     var decoded = verifyJWT(token);
     }
     catch(e){
         res.status(403).json({"message": "Unauthorized!"}); return;
     }
     let userExists = await usersCollection.findOne({'username': decoded})
     if(userExists){
     let list  = await collection.find({}).toArray()
     res.status(200).json(list)
     }
     else{
         res.status(403).json({"message": "Unauthorized!"})
     }
   })
 
 
 app.delete('/products' ,async function(req, res){
     console.log(req.query)
 
     let productId = parseInt(req.query.id)
     let wasFound = false
     let item = await collection.find({'id': productId})
     if(item) {wasFound = true}
     await collection.deleteOne({'id': productId})
     if(wasFound) {res.status(200).json({success: 'true'}) }
     else{
         res.status(404).json({success: 'false'})
     }
 })
 
 app.post('/products',async function(req, res){
 
     //name, price, brand
     try{
 
     let name = req.body.name
     let price = req.body.price
     let brand = req.body.brand
     let list  = await collection.find({}).toArray()
     let id = list.length;
 
     let token = req.headers.auth;
     try{
         var decoded = jwt.verify(token, myPrivateKey);
         }
         catch(e){
             res.status(403).json({"message": "Unauthorized!"})
         }
 
     let userExists = await usersCollection.findOne({'username': decoded})
     if(!userExists) { res.status(403).json({"message": "Unauthorized!"}); return;}
 
     let username = userExists.username
 
     if( !name || !price || !brand) { res.status(400).json({'success': false, 'message': "Must provide name, price and brand!"}); return;}
 
     console.log({ 'name': name, 'price':price, 'brand':brand, 'id': id})
     await collection.insertOne( { 'name': name, 'price':price, 'brand':brand, 'id': id, 'username': username})
     res.status(201).json({'sucess': 'true'})
     }
     catch(e)
     {   console.log(e)
         res.status(500).json({'sucess': 'false'})
     }
 })
}

module.exports = productRoutes