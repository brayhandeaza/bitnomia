import md5 from "md5";
import Blockchain from "../blockchain";
import { db } from "../db";


class RPCTransactions {
    static getPendingTransactions = async () => {
        try {
            const transaction = await Blockchain.getPendingTransactions()
            return {
                jsonrpc: "2.0",
                id: md5("success"),
                result: transaction
            }

        } catch (error) {
            return {
                jsonrpc: "2.0",
                id: md5("error"),
                error: {
                    code: error.code,
                    message: error.toString()
                }
            }
        }
    }

    static getTransactionByHash = async (hash: string): Promise<object> => {
        try {

            const transaction = await db.collection("transactions").findOne({ hash }, { projection: { _id: 0, signature: 0, _v: 0 } })

            if (transaction)
                return {
                    jsonrpc: "2.0",
                    id: md5(String(transaction.hash)),
                    result: transaction
                }

            const pipeline = [
                {
                    '$match': {
                        'transactions.hash': hash
                    }
                },
                {
                    '$project': {
                        'matched_transaction': {
                            '$arrayElemAt': [
                                {
                                    '$filter': {
                                        'input': '$transactions',
                                        'as': 'transaction',
                                        'cond': {
                                            '$eq': ['$$transaction.hash', hash]
                                        }
                                    },
                                },
                                0
                            ]
                        },
                        '_id': 0
                    }
                }
            ]

            const transactions = await db.collection("blocks").aggregate(pipeline).toArray()

            if (transactions[0]?.matched_transaction)
                return {
                    jsonrpc: "2.0",
                    id: md5(String(transactions[0].matched_transaction.hash)),
                    result: transactions[0].matched_transaction
                }

            return {
                jsonrpc: "2.0",
                id: md5(String(transactions)),
                result: {}
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

    static createTransaction = async (private_key: string, receiver: string, amount: number): Promise<object> => {
        try {
            if (!private_key || !receiver || !amount)

                return {
                    jsonrpc: "2.0",
                    id: md5("error"),
                    error: {
                        code: 400,
                        message: "Missing parameters in request. private_key, receiver, and amount are required",

                    }
                }

            const transaction = await Blockchain.createTransaction(private_key, receiver, amount)
            if (transaction["hash"])
                return {
                    jsonrpc: "2.0",
                    id: md5(String(transaction["hash"])),
                    result: transaction
                }

            return {
                jsonrpc: "2.0",
                id: md5("error"),
                error: {
                    code: 400,
                    message: transaction["message"],
                }
            }

        } catch (error) {
            return {
                jsonrpc: "2.0",
                id: md5("error"),
                error: {
                    code: 400,
                    message: "error in creating transaction",
                }
            }
        }
    }
}


export default RPCTransactions