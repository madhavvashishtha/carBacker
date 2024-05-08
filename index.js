const { MongoClient, ServerApiVersion } = require('mongodb');
const{mongoUrl,PORT} = require('./.env')
const express = require('express');
const app = express();

const dbName = 'Cluster0';


const uri = mongoUrl;
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
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}


app.get('/api/createUser',(req, res) => {
  if (req.url === '/createUser' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
          body += chunk.toString();
      });
      req.on('end', () => {
          const userData = JSON.parse(body);
          mongodb.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
              if (err) {
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ message: 'Internal Server Error' }));
                  return;
              }
              const db = client.db(dbName);
              const users = db.collection('users');
              bcrypt.hash(userData.password, 10, (err, hash) => {
                  if (err) {
                      res.writeHead(500, { 'Content-Type': 'application/json' });
                      res.end(JSON.stringify({ message: 'Internal Server Error' }));
                      client.close();
                      return;
                  }
                  const user = { username: userData.username, password: hash };
                  users.insertOne(user, (err, result) => {
                      if (err) {
                          res.writeHead(500, { 'Content-Type': 'application/json' });
                          res.end(JSON.stringify({ message: 'Internal Server Error' }));
                      } else {
                          const token = jwt.sign({ username: user.username }, 'secretKey', { expiresIn: '1h' });
                          res.writeHead(200, { 'Content-Type': 'application/json' });
                          res.end(JSON.stringify({ message: 'User created successfully', token: token }));
                      }
                      client.close();
                  });
              });
          });
      });
  } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Not Found' }));
  }
})


app.listen(PORT, () => {
  //console.log(`Server running at http://localhost:${PORT}`);
});
//run().catch(console.dir);
