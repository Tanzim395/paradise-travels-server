const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
//using MiddleWare
app.use(cors());
app.use(express.json());

//env port added
const port = process.env.PORT || 5000;

//MONGO URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.os44i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//DB NAME & COLLECTIONS
async function run() {
    try {
        await client.connect();
        const database = client.db("paradise_travels");
        const tourCollection = database.collection("tours");
        const orderCollection = database.collection("orders");
        const contactCollection = database.collection("contact");

        // GET ALL TOURS API
        app.get('/tours', async (req, res) => {
            const email = req.query.email;
            let query;
            let cursor;

            if (email) {
                query = { email: email };
                cursor = orderCollection.find(query);
            }

            else {
                query = {};
                cursor = tourCollection.find(query);
            };

            const events = await cursor.toArray();
            res.send(events);
        });

        // GET SINGLE TOUR API
        app.get('/tours/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cursor = tourCollection.findOne(query);
            const event = await cursor;
            res.send(event);
        });

        // POST TOUR
        app.post('/tours', async (req, res) => {
            const tour = req.body;
            const result = await tourCollection.insertOne(tour);
            res.send(result);
        });

        // DELETE TOUR
        app.delete('/tours/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await products.deleteOne(query);
            res.send(result);
        });

        // UPDATE TOUR
        app.put('/tours/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const tour = req.body;
            const updateDoc = {
                $set: {
                    name: tour.name,
                    price: tour.price,
                    image: tour.image,
                    description: tour.description,
                    duration: tour.duration
                },
            };
            const result = await tourCollection.updateOne(query, updateDoc);
            res.send(result);
        });

        // GET ALL ORDER
        app.get('/orders', async (req, res) => {
            const id = req.query.id;
            const email = req.query.email;

            let query;
            let cursor;
            let orders;

            if (id) {
                query = { _id: ObjectId(id) };
                cursor = orderCollection.findOne(query);
                orders = await cursor;
            }

            else if (email) {
                query = { email: email };
                cursor = orderCollection.find(query);
                orders = await cursor.toArray();
            }

            else {
                query = {};
                cursor = orderCollection.find(query);
                orders = await cursor.toArray();
            }
            res.send(orders);
        });

        // POST ORDER
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        });

        // DELETE ORDER
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        });

        // UPDATE ORDER
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const order = req.body;
            const updateDoc = {
                $set: {
                    name: order.name,
                    email: order.email,
                    phone: order.phone,
                    date: order.date,
                    tourName: order.tourName,
                    price: order.price,
                    image: order.image,
                    description: order.description,
                    duration: order.duration,
                    status: order.status
                },
            };
            const result = await orderCollection.updateOne(query, updateDoc);
            res.send(result);
        });

        // POST CONTACT
        app.post('/contact', async (req, res) => {
            const info = req.body;
            const result = await contactCollection.insertOne(info);
            res.send(result);
        });
    }

    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Welcome to Paradise Travels Server");
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

//server side code end here

//checking the error...check..again.