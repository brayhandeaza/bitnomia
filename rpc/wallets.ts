import md5 from 'md5';
import { db } from "../db";
import Wallet from "../wallets"
import Wallets from '../wallets';
import { DYNAMIC_DECIMAL } from '../helpers';

type JsonRpcRequest = {
    jsonrpc: '2.0';
    method: string;
    params?: any;
    id: number;
}

class RPCWallets {
    static unstake = async (private_key: string, amount: number) => {
        try {
            const wallet = await db.collection("wallets").findOne({ private_key })

            if (!wallet)
                return {
                    jsonrpc: "2.0",
                    id: md5("error"),
                    error: {
                        code: 400,
                        message: "Then given 'private_key' is invalid",
                    }
                }

            const staker = await db.collection("stakers").findOne({ "public_key": wallet["public_key"] })

            if (staker) {
                const verify = Wallets.verify(
                    private_key,
                    staker["signature"],
                    private_key
                )

                if (!verify)
                    return {
                        jsonrpc: "2.0",
                        id: md5("error"),
                        error: {
                            code: 400,
                            message: "Verification failed",
                        }
                    }

                if (Number(amount) <= Number(staker["balance"])) {
                    if (staker["balance"] - amount <= 0)
                        await db.collection("stakers").deleteOne({ "public_key": staker["public_key"] })
                    else
                        await db.collection("stakers").updateOne({ "public_key": staker["public_key"] }, {
                            $set: {
                                "balance": DYNAMIC_DECIMAL(Number(staker["balance"]) - Number(amount))
                            }
                        })

                    await db.collection("wallets").updateOne({ "public_key": wallet["public_key"] }, {
                        $set: {
                            "balance": DYNAMIC_DECIMAL(Number(wallet["balance"]) + Number(amount))
                        }
                    })

                    return {
                        jsonrpc: "2.0",
                        id: md5("ok"),
                        result: {
                            "amount": amount,
                            "status": "Unstaked successfully",
                        }
                    }
                }

                return {
                    jsonrpc: "2.0",
                    id: md5("error"),
                    error: {
                        code: 400,
                        message: "Then given 'amount' is insufficient",
                    }
                }
            }

            return {
                jsonrpc: "2.0",
                id: md5("error"),
                error: {
                    code: 400,
                    message: "Then given 'private_key' has not staking balance",
                }
            }

        } catch (error) {
            console.log("unstake", error);
            return {
                jsonrpc: "2.0",
                id: md5("error"),
                error: {
                    code: error.code,
                    message: error
                }
            }
        }
    }

    static stake = async (private_key: string, amount: number) => {
        try {
            if (private_key && amount) {
                const wallet = await db.collection("wallets").findOne({ private_key })

                if (!wallet)
                    return {
                        jsonrpc: "2.0",
                        id: md5("error"),
                        error: {
                            code: 400,
                            message: "Then given 'private_key' is invalid",
                        }
                    }


                if (Number(amount) <= Number(wallet["balance"])) {
                    const staking = await db.collection("stakers").findOne({ "public_key": wallet["public_key"] })

                    if (staking) {
                        const verify = Wallets.verify(
                            wallet["private_key"],
                            staking["signature"],
                            private_key
                        )

                        if (!verify)
                            return {
                                jsonrpc: "2.0",
                                id: md5("error"),
                                error: {
                                    code: 400,
                                    message: "Verification failed",
                                }
                            }

                        await db.collection("stakers").updateOne({ "public_key": wallet["public_key"] }, {
                            $set: {
                                "balance": DYNAMIC_DECIMAL(Number(staking["balance"]) + Number(amount))
                            }
                        })

                        await db.collection("wallets").updateOne({ "public_key": wallet["public_key"] }, {
                            $set: {
                                "balance": DYNAMIC_DECIMAL(Number(wallet["balance"]) - Number(amount))
                            }
                        })

                        return {
                            jsonrpc: "2.0",
                            id: md5(String(wallet["public_key"])),
                            result: {
                                "staker": wallet["public_key"],
                                "status": "success"
                            }
                        }
                    }
                    const signature = Wallets.sign(private_key, String(private_key))
                    const data = {
                        "signature": signature,
                        "public_key": wallet["public_key"],
                        "balance": amount,
                        "reward": 0,
                        "timestamp": Date.now()
                    }

                    await db.collection("stakers").insertOne(data)

                    await db.collection("wallets").updateOne({ "public_key": wallet["public_key"] }, {
                        $set: {
                            "balance": DYNAMIC_DECIMAL(Number(wallet["balance"]) - Number(amount))
                        }
                    })

                    return {
                        jsonrpc: "2.0",
                        id: md5(String(wallet["public_key"])),
                        result: {
                            "status": "success",
                            "amount": amount,
                        }
                    }
                }

                return {
                    jsonrpc: "2.0",
                    id: md5("error"),
                    error: {
                        code: 400,
                        message: "Insufficient balance",
                    }
                }
            }

            return {
                jsonrpc: "2.0",
                id: md5("error"),
                error: {
                    code: 400,
                    message: "Then given 'private_key' is invalid",
                }
            }

        } catch (error) {
            console.log("stake", error);
            return {
                jsonrpc: "2.0",
                id: md5("error"),
                error: {
                    code: error.code,
                    message: error
                }
            }
        }
    }

    static getWalletByPrivateKey = async (private_key: string) => {
        try {
            const wallet = await db.collection("wallets").findOne({ private_key }, { projection: { _id: 0, _v: 0 } })

            return {
                jsonrpc: "2.0",
                id: md5(String(wallet.public_key) || "md5"),
                result: wallet
            }

        } catch (error) {
            console.log("getWalletByPrivateKey", error);
            return {
                jsonrpc: "2.0",
                id: md5("error"),
                error: {
                    code: error.code,
                    message: error
                }
            }
        }
    }

    static getWalletTransactions = async (public_key: string) => {
        try {
            const pipeline = [
                {
                    "$match": {
                        "$or": [
                            { "transactions.sender": public_key },
                            { "transactions.receiver": public_key },
                        ]
                    }
                },
                {
                    "$unwind": "$transactions"
                },
                {
                    "$match": {
                        "$or": [
                            { "transactions.sender": public_key },
                            { "transactions.receiver": public_key },
                        ]
                    }
                },
                {
                    "$replaceRoot": { "newRoot": "$transactions" }
                },
                {
                    "$sort": { "transactions.timestamp": -1 }
                },
                {
                    "$addFields": { "status": "success" }
                },
                {
                    "$project": {
                        "signature": 0
                    }
                }
            ]
            const pool_pipelile = [
                {
                    "$match": {
                        "$or": [
                            { "sender": public_key },
                            { "receiver": public_key },
                        ]
                    },

                },
                {
                    "$project": {
                        "signature": 0,
                        "_id": 0
                    }
                }
            ]

            const block_transactions = await db.collection("blocks").aggregate(pipeline).toArray()
            const pool_transactions = await db.collection("transactions").aggregate(pool_pipelile).toArray()

            const transactions = [...block_transactions, ...pool_transactions]
            const sorted_transactions = transactions.sort((a, b) => {
                return b.timestamp - a.timestamp
            })

            return {
                jsonrpc: "2.0",
                id: md5(String(public_key) || "md5"),
                result: sorted_transactions
            }

        } catch (error) {
            console.log("getWalletTransactions", error);
            return {
                jsonrpc: "2.0",
                id: md5("error"),
                error: {
                    code: error.code,
                    message: error
                }
            }
        }
    }

    static getWalletStakingBalance = async (public_key: string) => {
        try {
            const wallet = await db.collection("stakers").findOne(
                {
                    "public_key": public_key
                },
                {
                    projection: {
                        "_id": 0,
                        "balance": 1
                    }
                },

            )


            return {
                jsonrpc: "2.0",
                id: md5(String(wallet["public_key"]) || "md5"),
                result: wallet
            }

        } catch (error) {
            return {
                jsonrpc: "2.0",
                id: md5("error"),
                error: {
                    code: 404,
                    message: "Wallet has not balance staking",
                }
            }
        }
    }

    static getWalletBalance = async (public_key: string) => {
        try {
            const wallet = await db.collection("wallets").findOne(
                {
                    "public_key": public_key
                },
                {
                    projection: {
                        "_id": 0,
                        "private_key": 0,
                    }
                }
            )

            return {
                jsonrpc: "2.0",
                id: md5(String(wallet["public_key"]) || "md5"),
                result: wallet
            }

        } catch (error: any) {
            return {
                jsonrpc: "2.0",
                id: md5("error"),
                error: {
                    message: "Wallet not found",
                }
            }
        }
    }

    static getWalletBalanceInBatch = async (_wallets: string[]) => {
        try {
            const wallets = await db.collection("wallets").find(
                {
                    "public_key": { "$in": _wallets }
                },
                {
                    projection: {
                        _id: 0,
                        public_key: 1,
                        balance: 1
                    }
                }
            ).toArray()

            return {
                jsonrpc: "2.0",
                id: md5(String(wallets[0]?.public_key) || "md5"),
                result: wallets
            }
        } catch (error) {
            return {
                jsonrpc: "2.0",
                id: md5("error"),
                error: {
                    code: error.code,
                    message: error
                }
            }
        }
    }

    static createWallet = async () => {
        try {
            const data = Wallet.createWallet()
            const wallets = await db.collection("wallets").insertOne(data)

            if (wallets.acknowledged) {
                return {
                    jsonrpc: "2.0",
                    id: md5(data.public_key),
                    result: {
                        public_key: data.public_key,
                        private_key: data.private_key,
                        balance: 0
                    }
                }
            }

            return {
                jsonrpc: "2.0",
                id: md5("error"),
                error: {
                    code: 400,
                    message: "error in creating wallet",
                }
            }

        } catch (error) {
            return {
                jsonrpc: "2.0",
                id: md5("error"),
                error: {
                    code: error.code,
                    message: error
                }
            }
        }
    }
}



export default RPCWallets
