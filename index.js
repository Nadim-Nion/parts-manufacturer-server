const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// Middlewares
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qf8hqc8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

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

        const database = client.db('partsDB');
        const partsCollection = database.collection('parts');
        const reviewsCollection = database.collection('reviews');
        const techNewsCollection = database.collection('techNews');
        const buildGuideCollection = database.collection('buildGuides');
        const purchasedPartsCollection = database.collection('purchasedParts');


        /*------------------------------------------ 
                Parts Collection API
        -------------------------------------------*/

        // Get all parts data
        app.get('/parts', async (req, res) => {
            const cursor = partsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });


        /*-------------------------------------------- 
                Reviews Collection API
        ---------------------------------------------*/

        // Get all reviews data
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });


        /*-------------------------------------------- 
                TechNews Collection API
        ---------------------------------------------*/

        // Get the all tech news data
        app.get('/techNews', async (req, res) => {
            const cursor = techNewsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });


        /*--------------------------------------------- 
                Build Guide Collection API
        ----------------------------------------------*/

        // Get the all build guide dat
        app.get('/buildGuides', async (req, res) => {
            const cursor = buildGuideCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });


        /*--------------------------------------------- 
                Purchased Parts Collection API
        ---------------------------------------------*/

        // Get all purchaseParts
        app.get('/purchasedParts', async (req, res) => {
            const cursor = purchasedPartsCollection.find();
            const result = await cursor.toArray();
            res.send(result);

        });

        // Create (or Insert) new purchasedParts
        app.post('/purchasedParts', async (req, res) => {
            const purchasedParts = req.body;
            const result = await purchasedPartsCollection.insertOne(purchasedParts);
            res.send(result);
        });

        // Delete a purchasedPart by its id
        app.delete('/purchasedParts/:id', async (req, res) => {
            const id = req.params;
            const query = { _id: new ObjectId(id) };
            const result = await purchasedPartsCollection.deleteOne(query);
            res.send(result);
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
    res.send('CompParts Hub is running successfully');
})

app.listen(port, () => {
    console.log(`CompParts Hub is running on the PORT: ${port}`);
})