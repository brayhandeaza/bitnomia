require('dotenv').config()
import express, { Express } from "express"
import bodyParser from "body-parser"
import cors from "cors"
import { client, db } from './db'
import server from './rpc'
import Block from "./blockchain/blocks"
import { serve, setup, swaggerSpec } from "./swagger"
import { GENESIS_WALLETS } from "./constants"


const app: Express = express()

app.use('/docs', serve, setup(swaggerSpec));

app.use(bodyParser.json())
app.use(cors())

app.post("/", (req, res) => {
    const jsonRPCRequest = req.body;
    server.receive(jsonRPCRequest).then((jsonRPCResponse) => {
        res.json(jsonRPCResponse)
    });
});

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to bitnomia",
        version: "1.0.0"
    })
})


client.connect().then(async () => {
    console.log("Connected to MongoDB")
    const genesis = await db.collection("blocks").findOne({ block_number: 0 })
    if (!!!genesis) {
        await db.collection("blocks").insertOne(Block.genesis())
        console.log("Genesis block inserted");
    }

    GENESIS_WALLETS.forEach(async ({ public_key, private_key, balance }) => {
        const wallet = await db.collection("wallets").findOne({ public_key, private_key })
        if (!!!wallet) {
            await db.collection("wallets").insertOne({ public_key, private_key, balance })
            console.log("Genesis wallets inserted");
        }
    })


}).catch((error) => {
    console.log(error)
})

app.listen(process.env.PORT || 3000, async () => {
    console.log(`Worker ${process.pid} listening on http://localhost:3000`)
})