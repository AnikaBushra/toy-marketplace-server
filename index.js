const express = require('express');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

// middleware

app.use(express.json())

const corsConfig = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}

app.use(cors(corsConfig))

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sdtdalu.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const toyCollections = client.db("toyCollection").collection("toys");
        const newToyCollections = client.db("toyCollection").collection("newToys");

        app.get('/allToys', async (req, res) => {
            const cursor = toyCollections.find()
            const result = await cursor.toArray();
            res.send(result)
        })

        // get a toy using email 
        app.get('/addAToy', async (req, res) => {
            let query = {}

            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const cursor = newToyCollections.find(query);
            const result = await cursor.toArray()
            res.send(result);
        })
        // get add  a toy 
        app.get('/addAToy', async (req, res) => {
            const cursor = newToyCollections.find();
            const result = await cursor.toArray()
            res.send(result);
        })


        // toy added by user 
        app.post('/addAToy', async (req, res) => {
            const body = req.body
            const result = await newToyCollections.insertOne(body);
            res.send(result);
        })

        app.delete('/addAToy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await newToyCollections.deleteOne(query);
            res.send(result)
        })
        // single data get 
        app.get('/addAToy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await newToyCollections.findOne(query);
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})