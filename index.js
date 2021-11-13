const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

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

    // POST API
    app.post('/services', async (req, res) => {
      const newService = req.body;

      const result = await servicesCollection.insertOne(newService);
      console.log(result);
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