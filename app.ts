require('dotenv').config()
import express, { Express } from "express"
import bodyParser from "body-parser"
import cors from "cors"
import { client, db } from './db'
import server from './rpc'
import Block from "./blockchain/blocks"
import { serve, setup, swaggerSpec } from "./swagger"
import { GENESIS_WALLETS } from "./constants"

// const doc = require('./swagger/data.json');
const app: Express = express()

app.use('/docs', serve, setup(swaggerSpec));

app.use(bodyParser.json())
app.use(cors())


app.get("/", async (req, res) => {
    const block = await Block.genesis()
    console.log(block);

    res.json({ block })
})


app.post("/", (req, res) => {
    const jsonRPCRequest = req.body;
    server.receive(jsonRPCRequest).then((jsonRPCResponse) => {
        res.json(jsonRPCResponse)
    });
});


client.connect().then(async () => {
    console.log("Connected to MongoDB")
    // await db.collection("wallets").insertMany(GENESIS_WALLETS)
    // await db.collection("blocks").insertOne(Block.genesis())

    app.listen(process.env.PORT || 3000, async () => {
        console.log("Listening on http://localhost:3000")
    })

}).catch((error) => {
    console.log(error)
})
