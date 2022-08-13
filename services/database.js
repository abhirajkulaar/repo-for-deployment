const { MongoClient } = require('mongodb');

const url = process.env.MONGO_URL;
const client = new MongoClient(url);
const dbName = 'products';

const db = client.db(dbName);
const collection = db.collection('products');
const usersCollection = db.collection('users')

module.exports = {collection, usersCollection}