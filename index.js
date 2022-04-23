const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bqm81.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db('practiceProject').collection('product');

        // Add New Product
        app.post('/product', async (req, res) => {
            const newProduct = req.body;
            console.log('New Product', newProduct);
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        });

        // Get All Products
        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        // Delete A Single Product
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
        });

        // Get Single Product
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.findOne(query);
            res.send(result);
        });

        // Update Single Product
        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const options = { upsert: true };
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    price: updatedUser.price,
                    img: updatedUser.img
                }
            };
            const result = await productCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })
    } finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('This is time to practice man..');
});

app.listen(port, () => {
    console.log('Listening to port', port);
});