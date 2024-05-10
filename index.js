const { MongoClient, ServerApiVersion } = require('mongodb');
//const {mongoUrl} = require('./.env') 
const express = require('express');
const cors = require('cors');
var envs = require('envs');
const app = express();
const sec='23'

app.use(cors());
app.use(cors(
  {
    origin:["http://localhost:5173/"] ,
    methods:"GET,POST,PUT",
    credentials:true
}
))
//const http = require('http');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//console.log(`Your port is ${process.env.PORT}`); // undefined
//const dotenv = require('dotenv');
//const config = dotenv.config();
//console.log(`Your port is ${process.env.PORT}`);

const dbName = 'usersAll';//'Cluster0';

//let uri =  envs('DATABASE_URL')+'' //process.env.DATABASE_URL;
const uri = 'mongodb+srv://madhav314159:rcilybQqqZyRXpt1@cluster0.nw8qfuz.mongodb.net/usersAll?retryWrites=true&w=majority&appName=Cluster0';;
//console.log(uri)
const PORT= 5000;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



var server =app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);

});


server.setTimeout(600000);
//server.keepAliveTimeout = 120000; //server.keepAliveTimeout and server.headersTimeout
//server.headersTimeout   = 120000;


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db(dbName).command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!"+uri+':'+sec);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}



app.get('/api/puchuserData02',(req, res) => {
try {
   // const db = client.db(dbName);
    const users = client.db('usersAll').collection('userGenAll');
    const user = { username: 'expuser001', password: 'this Is Supposedto be Has' };
    users.insertOne(user, (err, result) => {
        if (err) {
           // res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal Server Error' }));
        } else {
          //  const token = jwt.sign({ username: user.username }, 'secretKey', { expiresIn: '1h' });
          //  res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User created successfully', token: 'token' }));
        }
        client.close();
    });
} catch (error) {
  res.writeHead(400, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'upFront Error '+error }));
  
}
})


app.post('/api/createUserpost',async (req, res) => {
  try {
   // if (req.url === '/createUser' && req.method === 'POST') {
  if (true ) {//req.url === '/createUser' && req.method === 'POST'
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    await new Promise((resolve, reject) => {
      req.on('end', resolve);
      req.on('error', reject);
    });

    const userData = JSON.parse(body);
    const db = client.db(dbName);
    const users = db.collection('userGenAll');
    const hash = await bcrypt.hash(userData.password, 10);
    const user = { username: userData.username, role: userData.role, password: hash };
    const result = await users.insertOne(user);
    const token = jwt.sign({ username: user.username, role: user.role }, 'secretKey', { expiresIn: '1h' });

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Length', Buffer.byteLength({tokenGet:token}));
    res.status(200).send({tokenGet:token});
  } else {
    res.status(404).json({ message: 'Not Found' });
  }
} catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Internal Server Error' });
}
});


app.get('/api/createUser',(req, res) => {
  if (true ) {//req.url === '/createUser' && req.method === 'POST'
      let body = '';
      req.on('data', chunk => {
          body += chunk.toString();
      });
      req.on('end', () => {
          const userData = JSON.parse(body);
        //  client.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
        //      if (err) {
        //          res.writeHead(500, { 'Content-Type': 'application/json' });
        //          res.end(JSON.stringify({ message: 'Internal Server Error' }));
        //          return;
        //      }
              const db = client.db(dbName);
              const users = db.collection('userGenAll');
              bcrypt.hash(userData.password, 10, (err, hash) => {
                  if (err) {
                      res.writeHead(500, { 'Content-Type': 'application/json' });
                      res.end(JSON.stringify({ message: 'Internal Server Error bi2' }));
                      client.close();
                      return;
                  }
                  const user = { username: userData.username,role:userData.role, password: hash };
                  users.insertOne(user, (err, result) => {
                      if (err) {
                          res.writeHead(500, { 'Content-Type': 'application/json' });
                          res.end(JSON.stringify({ message: 'Internal Server Error' }));
                      } else {
                          const token = jwt.sign({ username: user.username,role:user.role }, 'secretKey', { expiresIn: '1h' });
                          res.writeHead(200, { 'Content-Type': 'application/json' });
                        
                          res.end(JSON.stringify({ message: 'User created successfully', token: token }));
                      }
                      client.close();
                  });
              });
         // });
      });
  } else {//
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Not Found' }));
  }
})


app.get('/api/helloYou',(req, res) => {
  console.log('hello there')
  res.writeHead(200, { 'Content-Type': 'application/json' });
 
  res.end(JSON.stringify({ message: 'hello successfully' }));
})


//run().catch(console.dir);
