const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
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