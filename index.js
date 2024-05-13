const { MongoClient, ServerApiVersion } = require('mongodb');
//const {mongoUrl} = require('./.env') 
const express = require('express');
const cors = require('cors');
var envs = require('envs');
const { faker } = require('@faker-js/faker');
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



app.post('/api/purchageRqrInit',async (req, res) => {
  try {
   // if (req.url === '/createUser' && req.method === 'POST') {
  if (true ) {//req.url === '/createUser' && req.method === 'POST'
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });


//    import { EventEmitter } from 'node:events';
//    const myEE = new EventEmitter();
//    myEE.on('foo', () => console.log('a'));
//    myEE.prependListener('foo', () => console.log('b'));
//    myEE.emit('foo');

    await new Promise((resolve, reject) => {
      req.on('end', resolve);
      req.on('error', reject);
    });

    const userData = JSON.parse(body);
    const db = client.db(dbName);
    const userDocCollat        = db.collection('userGenAll');
    const allPurchageReqCollat = db.collection('userPurReq');
   // const hash = await bcrypt.hash(userData.password, 10);
    const userPurchagReq = {

      Email       :userData.Email       ,
      Model       :userData.Model       ,
      Colour      :userData.Colour      ,
      Fuel        :userData.Fuel        ,
      Manufacturer:userData.Manufacturer,
      Vehicle     :userData.Vehicle     ,
      VIN         :userData.VIN         ,
      VRM         :userData.VRM         ,
      UrlImg      :userData.UrlImg      ,
      Price       :userData.Price       ,

     };
    
const promise1PushInProfi = new Promise(async (resolve,reject)=>{
           
    await userDocCollat.updateOne({  username: userData.Email }, { $push: { 'arrayField': { $each: [userPurchagReq] } } }, (err, result) => {
      if (err) {
        //throw err;
        reject();
      }
      resolve();
    
    });
    
          })
const promise2PushInMain = new Promise(async (resolve, reject) => {
  await allPurchageReqCollat.updateOne( {  username: userData.Email }, { $push: { 'arrayField': { $each: [userPurchagReq] } } }, { upsert: true }, (err, result) => {
    if (err) {
      //throw err;
      reject();
    }
    resolve();
  
  });
});


 Promise.all([promise1PushInProfi, promise2PushInMain])
  .then((results) => results.forEach((result) => {
     // console.log(result)
   res.setHeader('Content-Type', 'text/plain');
   // res.setHeader('Content-Length', Buffer.byteLength({tokenGet:token}));
   res.status(200).send({
                         mainLoad:userPurchagReq,
                         DocID:extUserProfiDocId,
                         result:result
                        
                       });
    req.emit('end');
  }
  ) )
  .catch(console.error);

  




   
  
     



     
   
  } else {
    res.status(404).json({ message: 'Not Found' });
  }
} catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Internal Server Error' +error});
}
});

app.post('/api/hotDeals',async (req, res) => {
  try {
   // if (req.url === '/createUser' && req.method === 'POST') {
//  if (true ) {//req.url === '/createUser' && req.method === 'POST'
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    await new Promise((resolve, reject) => {
      req.on('end', resolve);
      req.on('error', reject);
    });

    const userData = JSON.parse(body);
    //const db = client.db(dbName);
  //  const users = db.collection('userGenAll');

   // const tokenStatVerifiy=jwt.verify(userData.token, 'secretKey');
   // const hash = await bcrypt.hash(userData.password, 10);
  //  const user = { username: userData.username, role: userData.role, password: hash };
  //  const result = await users.insertOne(user);
   // const token = jwt.sign({ username: user.username, role: user.role }, 'secretKey', { expiresIn: '1h' });
   //let vehicleArray=[{}];
   let result;
   let vehicleArray=[]
     for(let i=0; userData.reqNo >i ;i++){
      let vichalPushElement={
        colour      :faker.vehicle.color() ,
        fuel        :faker.vehicle.fuel(),
        manufacturer: faker.vehicle.manufacturer() ,
        model       : faker.vehicle.model(),
        vehicle     :faker.vehicle.vehicle(),
        vin         :faker.vehicle.vin(),
        vrm         :faker.vehicle.vrm(),
      }
      vehicleArray.push(vichalPushElement)
     // const carList = db.collection('carAll');
     // result = await carList.insertOne(vichalPushElement);
    }

    res.setHeader('Content-Type', 'text/plain');
   // res.setHeader('Content-Length', Buffer.byteLength({tokenGet:token}));
    res.status(200).send({result:result+'-s-',
    dealsToOffer:vehicleArray
    });
 // } else {
 //   res.status(404).json({ message: 'Not Found' });
 // }
} catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Internal Server Error' +error});
}
});


app.post('/api/fillTheFakerVichel',async (req, res) => {
  try {
   // if (req.url === '/createUser' && req.method === 'POST') {
//  if (true ) {//req.url === '/createUser' && req.method === 'POST'
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
  //  const users = db.collection('userGenAll');

   // const tokenStatVerifiy=jwt.verify(userData.token, 'secretKey');
   // const hash = await bcrypt.hash(userData.password, 10);
  //  const user = { username: userData.username, role: userData.role, password: hash };
  //  const result = await users.insertOne(user);
   // const token = jwt.sign({ username: user.username, role: user.role }, 'secretKey', { expiresIn: '1h' });
   let vehicleArray=[];
   let result
     for(let i=0; userData.reqNo >i ;i++){
      let vichalPushElement={
        colour:faker.vehicle.color() ,
        fuel  :faker.vehicle.fuel(),
        manufacturer: faker.vehicle.manufacturer() ,
        model : faker.vehicle.model(),
        vehicle :faker.vehicle.vehicle(),
        vin :faker.vehicle.vin(),
        vrm :faker.vehicle.vrm(),
      }
     
      const carList = db.collection('carAll');
       result = await carList.insertOne(vichalPushElement);
    }

    res.setHeader('Content-Type', 'text/plain');
   // res.setHeader('Content-Length', Buffer.byteLength({tokenGet:token}));
    res.status(200).send({result:result+'-s-'
    });
 // } else {
 //   res.status(404).json({ message: 'Not Found' });
 // }
} catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Internal Server Error' +error});
}
});



app.post('/api/pingToken',async (req, res) => {
  try {
   // if (req.url === '/createUser' && req.method === 'POST') {
//  if (true ) {//req.url === '/createUser' && req.method === 'POST'
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    await new Promise((resolve, reject) => {
      req.on('end', resolve);
      req.on('error', reject);
    });

    const userData = JSON.parse(body);
   // const db = client.db(dbName);
  //  const users = db.collection('userGenAll');

    const tokenStatVerifiy=jwt.verify(userData.token, 'secretKey');
   // const hash = await bcrypt.hash(userData.password, 10);
  //  const user = { username: userData.username, role: userData.role, password: hash };
  //  const result = await users.insertOne(user);
   // const token = jwt.sign({ username: user.username, role: user.role }, 'secretKey', { expiresIn: '1h' });

    res.setHeader('Content-Type', 'text/plain');
   // res.setHeader('Content-Length', Buffer.byteLength({tokenGet:token}));
    res.status(200).send({tokenStat:tokenStatVerifiy});
 // } else {
 //   res.status(404).json({ message: 'Not Found' });
 // }
} catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Internal Server Error' +error});
}
});



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
    const user = { username: userData.username, role: userData.role, password: hash,areacode:userData.areacode };
    const result = await users.insertOne(user);
    const token = jwt.sign({ username: user.username, role: user.role }, 'secretKey', { expiresIn: '1h' });

    res.setHeader('Content-Type', 'text/plain');
   // res.setHeader('Content-Length', Buffer.byteLength({tokenGet:token}));
    res.status(200).send({tokenGet:token,
                          role:userData.role,
                          email:userData.username,
                          areacode:userData.areacode
                        });
  } else {
    res.status(404).json({ message: 'Not Found' });
  }
} catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Internal Server Error' +error});
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
