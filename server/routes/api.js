const {MongoClient} = require("mongodb");
const URL = "mongodb://localhost:27017";
const client = new MongoClient(URL);
const express = require('express');
const router = express.Router();
// const mongoose = require('mongoose');
const User = require('../models/user');
const jwt = require('jsonwebtoken')

// const db = "mongodb://localhost:27017";

/*
mongoose.connect(db, function(err){
    if(err){
        console.error('Error! ' + err)
    } else {
      console.log('Connected to mongodb')      
    }
});
*/

async function GetConnection()
{
    let result = await client.connect();
    let db = result.db("EventHub");

    return db
}

async function readEventBatchDetails(req,res)
{
   let dataBase = await GetConnection();
   let collection = dataBase.collection("Event_Batch_Details");

   let data = await collection.find().toArray();

    res.json(data);
}

async function insertEventBatchUserData(req,res)
{
    let newData = req.body;

    let dataBase = await GetConnection(); 
    let collection = dataBase.collection("Event_Batch_User_Details");
    let result = await collection.insertOne(newData);

    res.status(200).send({
        "status":true,
        "message":"Form Submitted succesfully"
    })
}

async function countEventUsers(req,res)
{
  let dataBase = await GetConnection();
  let collection = dataBase.collection("Event_Batch_User_Details");
  let count = await collection.countDocuments({});

  res.json({count});

}

function verifyToken(req, res, next) 
{
  if(!req.headers.authorization) 
  {
    return res.status(401).send('Unauthorized request')
  }

  let token = req.headers.authorization.split(' ')[1]

  if(token === 'null') 
  {
    return res.status(401).send('Unauthorized request')    
  }

  let payload = jwt.verify(token, 'secretKey');

  if(!payload) 
  {
    return res.status(401).send('Unauthorized request')    
  }

  req.userId = payload.subject;

  next();

}

async function readSpecialEventBatchDetails(req,res)
{

   let dataBase = await GetConnection();

   let collection = dataBase.collection("Special_Batch_Details");

   let data2 = await collection.find().toArray();

   res.json(data2);
}

async function countEventUserBatches(req,res)
{
  
  let dataBase = await GetConnection();

  let collection = dataBase.collection("Event_Batch_User_Details");

   let GoLang = await collection.countDocuments({batch:"GoLang"});
   let WebDevelopment = await collection.countDocuments({batch:"Angular: Web Development"})
   let PythonML = await collection.countDocuments({batch:"Python: Machine Learning"})
   let MachineLearning = await collection.countDocuments({batch:"Machine Learning"})
   let IPhoneProgramming = await collection.countDocuments({batch:"IPhone Programming"})
   let AndroidProgramming = await collection.countDocuments({batch:"Android Programming"})
   
  res.json({WebDevelopment,GoLang,PythonML,MachineLearning,IPhoneProgramming,AndroidProgramming});
}

async function login(req,res)
{
    
    let dataBase = await GetConnection();

    let collection = dataBase.collection("Special_Batch_User_Details");
    
    let userData = req.body;

    let dbuser = await collection.findOne({"username":userData.email});
  
    if(!dbuser) 
    {
      return res.status(401).send("Invalid Email or Password"); 
    }   
    else if((dbuser.username == userData.email) && (dbuser.registration_id == userData.password)) 
    {
      let payload = {subject: 1}
      let token = jwt.sign(payload, 'secretKey');
      res.status(200).send({token})   
    } 
    else 
    {
        return res.status(401).send('Invalid Password');
    } 
}


async function insertSpecialBatchUserData(req,res)
{
    let newData = req.body;

    let dataBase = await GetConnection(); 
    let collection = dataBase.collection("Special_New_Batch_User_Details");
    let result = await collection.insertOne(newData);

    res.status(200).send({
        "status":true,
        "message":"Form Submitted succesfully"
    })
}

async function countSpecialUserBatches(req,res)
{
  
  let dataBase = await GetConnection();

  let collection = dataBase.collection("Special_New_Batch_User_Details");

   let IOT = await collection.countDocuments({batch:"IOT"});
   let IOS = await collection.countDocuments({batch:"IOS Internals"})
   let LSP = await collection.countDocuments({batch:"LSP"})
   let Struts = await collection.countDocuments({batch:"Struts"})
   let Embedded = await collection.countDocuments({batch:"Embedded Programming"})
   let IOTWorkshop = await collection.countDocuments({batch:"IOT Workshop"});
   
  res.json({IOT,IOS,LSP,Struts,Embedded,IOTWorkshop});
}

async function countSpecialEventUsers(req,res)
{
  let dataBase = await GetConnection();
  let collection = dataBase.collection("Special_New_Batch_User_Details");
  let count = await collection.countDocuments({});

  res.json({count});

}
  router.get('/count',countEventUsers); 

  router.get('/countEventUserBatches',countEventUserBatches);

  router.post('/insertEventBatchUserData',insertEventBatchUserData);

  router.get('/events',readEventBatchDetails);


  

  router.post('/login',login);
  
  router.get('/special',verifyToken,readSpecialEventBatchDetails);

  router.post('/insertSpecialBatchUserData',insertSpecialBatchUserData);

  router.get('/countSpecialUserBatches',countSpecialUserBatches);

  router.get('/countSpecialEventUsers',countSpecialEventUsers); 


module.exports = router;
