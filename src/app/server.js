const { MongoClient } = require("mongodb");
const URL = "mongodb://localhost:27017";
const client = new MongoClient(URL);
const cors = require("cors")
const bodyparser = require('body-parser');
const express = require('express');
const eobj = express.Router();

const port = 5200;

eobj.use(bodyparser.json());
eobj.use(cors());

eobj.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

eobj.listen(port, function(req, res) {
    console.log("Indira server is started");
});

async function GetConnection_Event_Batch_Details() {
    let result = await client.connect();
    let db = result.db("RestaurantProject");
    return db.collection("Event_Batch_Details");
}

eobj.get('/', MarvellousGet);


function MarvellousGet(req, res) {
    res.send("Indira Server is ON");
}

eobj.get("/getData", ReadData);

async function ReadData(req, res) {
    let data = await GetConnection_Event_Batch_Details();

    data = await data.find().toArray();

    res.json(data);
}