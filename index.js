const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// Middlewares
app.use(cors({
    origin: [
        'http://localhost:5173'
    ],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());


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
        const paymentCollection = database.collection('payments');
        const profileCollection = database.collection('profiles');
        const userCollection = database.collection('users');

        /*-------------------------------   
                Custom Middlewares 
        ---------------------------------*/

        // User have to logged-in or signed-up to get the access of data
        const verifyToken = (req, res, next) => {
            const token = req.cookies.token;
            // console.log('Token in the middleware:', token);
            if (!token) {
                return res.status(401).send({ message: 'unauthorized access' });
            }
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).send({ message: 'unauthorized access' });
                }
                req.user = decoded;
                next();
            })
        };

        // verify the user is admin or not after verifyToken
        const verifyAdmin = async (req, res, next) => {
            const email = req.user.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            const isAdmin = user?.role === 'admin';
            if (!isAdmin) {
                return res.status(403).send({ message: 'forbidden access' });
            }
            next();
        }

        /*----------------------------- 
                JWT API
        -----------------------------*/

        // JWT related API
        app.post('/jwt', async (req, res) => {
            const user = req.body;
            // console.log('User for token:', user);
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            res
                .cookie('token', token, {
                    httpOnly: true,
                    secure: true, // Make it true in the Production Stage
                    sameSite: 'none'
                })
                .send({ success: true });
        });

        // Clear the Cookie after logging-out
        app.post('/logout', async (req, res) => {
            const user = req.body;
            // console.log('Logging-out user:', user);
            res
                .clearCookie('token', { maxAge: 0 })
                .send({ success: true });
        });

        /*------------------------------------------ 
                Parts Collection API
        -------------------------------------------*/

        // Get all parts data
        app.get('/parts', async (req, res) => {
            const cursor = partsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        // Create (or Add) a new part data
        app.post('/parts', verifyToken, verifyAdmin, async (req, res) => {
            const part = req.body;
            const result = await partsCollection.insertOne(part);
            res.send(result);
        });

        // Delete an specific Part Item by its id
        app.delete('/parts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            console.log(query);
            const result = await partsCollection.deleteOne(query);
            console.log(result);
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

        // Create (or Add) a new review
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            if (review.rating) {
                review.rating = parseInt(review.rating, 10);
            }
            const result = await reviewsCollection.insertOne(review);
            res.send(result)
        })


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

        // Get all purchaseParts (Logged-in users can view their purchasedParts)
        app.get('/purchasedParts', verifyToken, async (req, res) => {
            const email = req.query.email;
            // console.log('Cookie in PurchasedParts:', req.cookies);
            // console.log('Token owner info:', req.user);
            if (req.user.email !== req.query.email) {
                return res.status(403).send({ message: 'forbidden access' });
            }
            const query = { userEmail: email };
            const cursor = purchasedPartsCollection.find(query);
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
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await purchasedPartsCollection.deleteOne(query);
            res.send(result);
        });

        /*--------------------------------- 
                Payment Intent API
        ---------------------------------*/

        // Create a Payment Intent
        app.post('/create-payment-intent', async (req, res) => {
            const { price } = req.body;
            const amount = price * 100;

            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: 'usd',
                payment_method_types: [
                    'card'
                ]
            });

            res.send({
                clientSecret: paymentIntent.client_secret
            });
        });


        /*-------------------------------------- 
                Aggregation Pipeline API
        --------------------------------------*/

        // Implement aggregation pipeline on PurchasedParts Collection to get details about parts from Parts Collection
        app.get('/purchasedParts/details', verifyToken, async (req, res) => {
            const email = req.query.email;
            // console.log('Cookie in purchasedParts with Details:', req.cookies);
            // console.log('Token owner info:', req.user);
            if (req.user.email !== req.query.email) {
                return res.status(403).send({ message: 'forbidden access' });
            }
            const query = { userEmail: email };
            const result = await purchasedPartsCollection.aggregate([
                {
                    $match: query
                },
                {
                    $addFields: {
                        partId: {
                            $toObjectId: "$partId"
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'parts',
                        localField: 'partId',
                        foreignField: '_id',
                        as: 'partDetails'
                    }
                },
                {
                    $unwind: "$partDetails"
                },
                {
                    $addFields: {
                        totalPrice: {
                            $multiply: ['$quantity', '$partDetails.price_per_unit']
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        partsName: 1,
                        userName: 1,
                        userEmail: 1,
                        quantity: 1,
                        price_per_unit: "$partDetails.price_per_unit",
                        totalPrice: 1,
                        userAddress: 1,
                        phone: 1
                    }
                }
            ]).toArray();

            res.send(result);
        });


        /*--------------------------------- 
                Payment Collection API
        ---------------------------------*/

        // Get the all payment resources (Logged-in users can view their purchasedParts)
        app.get('/payments', verifyToken, async (req, res) => {
            const email = req.query.email;
            // console.log('Cookie in Payments:', req.cookies);
            // console.log('Token owner info:', req.user);
            if (req.user.email !== req.query.email) {
                return res.status(403).send({ message: 'forbidden access' });
            }
            const query = { email: email };
            const cursor = paymentCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        // Create (Add) a new resource
        app.post('/payments', async (req, res) => {
            const payment = req.body;
            const result = await paymentCollection.insertOne(payment);
            res.send(result);
        });

        /*-------------------------------------- 
               Profile Collection API
        ---------------------------------------*/

        // Create (Add) a new profile info
        app.post('/myProfiles', async (req, res) => {
            const userInfo = req.body;
            const result = await profileCollection.insertOne(userInfo);
            res.send(result);
        });

        /*----------------------------------------- 
                User Collection API
        ------------------------------------------*/

        // Get all users info
        app.get('/users', verifyToken, verifyAdmin, async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        // Check the user is admin or not
        app.get('/users/admin/:email', verifyToken, async (req, res) => {
            const email = req.params.email;
            if (email !== req.user.email) {
                return res.send({ message: 'forbidden access' });
            }
            const query = { email: email };
            const user = await userCollection.findOne(query);
            let admin = false;
            if (user) {
                admin = user?.role === 'admin'
            }
            res.send({ admin });
        });

        // Create a new user info
        app.post('/users', async (req, res) => {
            const user = req.body;
            // Insert a user to the DB if he doesn't exist
            const query = { email: user.email };
            const existingUser = await userCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: 'user already exists', insertedId: null });
            }
            const result = await userCollection.insertOne(user);
            res.send(result);
        });

        // Update the specific field of a document
        app.patch('/users/admin/:id', verifyToken, verifyAdmin, async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set: {
                    role: 'admin'
                }
            };
            const result = await userCollection.updateOne(filter, updatedDoc);
            res.send(result);
        })

        // Delete a user by its id
        app.delete('/users/:id', verifyToken, verifyAdmin, async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        });

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