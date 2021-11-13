const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = 4000;

// Middlewares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cyrhg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db('carMechanic');
    const servicesCollection = database.collection('services');

    // GET API
    app.get('/services', async (req, res) => {

      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();

      res.send(services);
    })

    // GET single
    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      console.log("id ", id);
      const query = {_id: ObjectId(id)};
      console.log('query ', query);

      const service = await servicesCollection.findOne(query);
      res.json(service);
    })

    // POST API
    app.post('/services', async (req, res) => {
      const newService = req.body;

      const result = await servicesCollection.insertOne(newService);
      console.log(result);
      res.json(result);
    });

    // DELETE API
    app.delete('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};

      const result = await servicesCollection.deleteOne(query);

      res.json(result);
    })
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res)=> {
  res.send('Running Genius Server');
})

app.listen(port, ()=> console.log("running genius server: ", port));