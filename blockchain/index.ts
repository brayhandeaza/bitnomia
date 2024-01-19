import md5 from "md5"
import {BITNOMIA_WALLET_PRIVATE_KEY, BITNOMIA_WALLET_PUBLIC_KEY, TRANSACTION_FEE_PERCENTAGE, VALIDATING_REWARD } from "../constants"
import { db } from "../db"
import PoS from "../pos"
import Transactions from "../transactions"
import Utils from "../utils"
import Wallets from "../wallets"
import Block from "./blocks"
import { DYNAMIC_DECIMAL } from "../helpers"


class Blockchain {
    static getBlockByBlockNumber = async (block_number: number) => {
        try {
            const block = await db.collection("blocks").findOne({ block_number }, { projection: { _id: 0, signature: 0, _v: 0 } })
            return block

        } catch (error) {
            return {}
        }

    }

    static getBlocksCount = async () => {
        try {
            const count = await db.collection("blocks").countDocuments()
            return count

        } catch (error) {
            return 0
        }
    }

    static getBlockTransactions = async (hash: string) => {
        try {

            const transactions = await db.collection("blocks").findOne({ hash }, { projection: { _id: 0, transactions: 1 } })
            return transactions.transactions || []

        } catch (error) {
            return []
        }
    }

    static getPendingTransactions = async (status: string = "pending") => {
        try {
            const pipeline = [
                {
                    "$addFields": { "status": status }
                },
                {
                    "$project": {
                        "signature": 0,
                        "_id": 0,
                        "_v": 0
                    }
                }
            ]

            const transactions = await db.collection("transactions").aggregate(pipeline).sort({ timestamp: 1 }).toArray()
            return transactions

        } catch (error) {
            return []
        }
    }

    static addBlock = async () => {
        try {
            if (Blockchain.isChainValid()) {
                const pos = new PoS()
                const validator = await pos.validator()

                const transactions = await Blockchain.getPendingTransactions("success")
                const block = await Block.createBlock(validator, transactions)

                if (transactions.length > 0) {
                    await Blockchain.executeTransactions(transactions)
                    await Blockchain.transferReward(validator)

                    await db.collection("blocks").insertOne({
                        ...block,
                        status: "success"
                    })


                    const blocks = await db.collection("blocks").find({}).sort({ block_number: -1 }).limit(200).toArray()
                    const hash = Utils.hash(JSON.stringify(blocks))
                    const signature = Wallets.sign(hash, BITNOMIA_WALLET_PRIVATE_KEY)

                    await db.collection("validators").insertOne({
                        signature,
                        validator,
                        timestamp: Date.now(),
                    })

                    return {
                        "hash": block["hash"]
                    }
                }

                return false
            } else {
                const invalidBlock = Block.createBlock(BITNOMIA_WALLET_PUBLIC_KEY)

                await db.collection("corructed_block").insertOne({
                    ...invalidBlock,
                    status: "failed"
                })

                return {
                    "hash": invalidBlock["hash"],
                    "message": "invalid corrupt block"
                }
            }

        } catch (error) {
            console.log("addBlock", error);
            return false
        }
    }

    static createTransaction = async (private_key: string, _receiver: string, amount: number) => {
        try {
            const wallet = await db.collection("wallets").findOne({ private_key: private_key })
            const receiver = await db.collection("wallets").findOne({ public_key: _receiver })


            if (wallet && wallet["private_key"] == private_key) {
                const fee: number = Math.round(amount * TRANSACTION_FEE_PERCENTAGE * 1000) / 1000;
                const total: number = amount - fee

                const receiver_public_key = receiver ? receiver["public_key"] : BITNOMIA_WALLET_PUBLIC_KEY

                if (wallet["balance"] >= amount && wallet["balance"] > 0) {
                    const transaction = new Transactions(wallet["public_key"], receiver_public_key, total)
                    const signature: string = Wallets.sign(private_key, transaction.hash)
                    transaction.sign(signature)

                    await db.collection("wallets").updateOne({ public_key: wallet["public_key"] }, {
                        $set: {
                            balance: DYNAMIC_DECIMAL(Number(wallet["balance"]) - Number(amount))
                        }
                    })

                    const fee_transaction = new Transactions(wallet["public_key"], BITNOMIA_WALLET_PUBLIC_KEY, fee)
                    const fee_signature: string = Wallets.sign(private_key, fee_transaction.hash)
                    fee_transaction.sign(fee_signature)

                    await db.collection("transactions").insertMany([
                        transaction.toJSON(),
                        fee_transaction.toJSON()
                    ])

                    return {
                        "hash": transaction.hash
                    }
                }

                return {
                    "hash": false,
                    "message": "not enough balance"
                }
            }

            return {
                "hash": false,
                "message": "invalid private key"
            }
        } catch (error) {
            console.log("createTransaction", error);

            return {
                "hash": false,
                "message": error
            }
        }
    }

    static transferReward = async (validator: string) => {
        try {
            const transaction = new Transactions(BITNOMIA_WALLET_PUBLIC_KEY, validator, VALIDATING_REWARD)
            const signature: string = Wallets.sign(BITNOMIA_WALLET_PRIVATE_KEY, transaction.hash)
            transaction.sign(signature)

            await db.collection("wallets").updateOne({ public_key: BITNOMIA_WALLET_PUBLIC_KEY }, {
                $inc: {
                    balance: -DYNAMIC_DECIMAL(VALIDATING_REWARD)
                }
            })

            await db.collection("transactions").insertOne(transaction.toJSON())

        } catch (error) {
            console.log("transferReward", error);
        }
    }

    static executeTransactions = async (transactions: any[] = []) => {
        try {
            if (transactions.length > 0) {
                transactions.forEach(async (transaction) => {

                    await db.collection("wallets").updateOne({ public_key: transaction["sender"] }, {
                        $inc: {
                            balance: DYNAMIC_DECIMAL(-transaction["amount"])
                        }
                    })

                    await db.collection("wallets").updateOne({ public_key: transaction["receiver"] }, {
                        $inc: {
                            balance: DYNAMIC_DECIMAL(transaction["amount"])
                        }
                    })

                    await db.collection("transactions").deleteOne({
                        hash: transaction["hash"]
                    })
                })
            }

        } catch (error) {
            console.log("executeTransactions", error);
        }
    }

    static isChainValid = async () => {
        try {
            const blocks = await db.collection("blocks").find({}).limit(200).toArray()

            if (!blocks) return false

            if (blocks[0]["last_hash"] != Utils.hash("genesis")) return false

            if (blocks[0]["last_hash"] == Utils.hash("genesis")) return true

            const validationSignature = await db.collection("validators").find({}).sort({ timestamp: -1 }).limit(1).next()

            if (validationSignature) {
                const hash = Utils.hash(JSON.stringify(blocks))
                const verify = Wallets.verify(
                    BITNOMIA_WALLET_PUBLIC_KEY,
                    String(validationSignature["signature"]),
                    hash
                )

                return verify
            }
            return false

        } catch (error) {
            console.log(error);
            return false
        }
    }
}

export default Blockchain