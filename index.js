const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// MiddleWare
app.use(cors());
app.use(express.json());

//Mongodb connection string
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zra8b4u.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('VolunteerNetwork').collection('Service');

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const result = await serviceCollection.findOne(query);
            res.send(result)
        })
        app.post('/services', async (req, res) => {
            const user = req.body;
            const result = await serviceCollection.insertOne(user);
            res.send(result)
        })
        app.put('/services/:id', async (req, res) =>{
            const id = req.params.id
            const body = req.body
            const filter = {_id: ObjectId(id)}
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: body.name,
                    address: body.address,
                    number:body.number
                }
            }
            const result = await serviceCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })
        app.delete('/services/:_id', async (req, res) =>{
            const id = req.params._id
            const query = {_id : ObjectId(id)}
            const result = await serviceCollection.deleteOne(query)
            res.send(result)
        })
    }
    finally { }
}
run().catch(console.dir)

app.listen(port, () => {
    console.log('listening the port', port)
});





// app.put('/services/:_id', async (req, res) =>{
//     const id = req.params._id;
//     const updatedUser = req.body;
//     const filter = {_id: ObjectId(id)}
//     const options = { upsert: true };
//     const updateDoc = {
//         $set: {
//             name: updatedUser.name,
//             address: updatedUser.address,
//             phone: updatedUser.number
//         }
//     };
//     const result = await serviceCollection.updateOne(filter, updateDoc, options);
//     res.send(result);
// })