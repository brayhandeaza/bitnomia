import md5 from 'md5';
import { db } from "../db";
import Blockchain from "../blockchain"
import { MAX_SUPPLY } from "../constants";


class RPCBlockchain {

    static getBlockByBlockNumber = async (block_number: number) => {
        try {
            const blocks = await Blockchain.getBlockByBlockNumber(block_number)
            if (blocks)
                return {
                    jsonrpc: "2.0",
                    id: md5(String(blocks)),
                    result: blocks
                }

            return {
                jsonrpc: "2.0",
                id: md5(String(blocks)),
                error: {
                    code: 404,
                    message: "block not found"
                }
            }

        } catch (error) {
            return {
                jsonrpc: "2.0",
                id: md5(String(error)),
                error: {
                    code: 400,
                    message: "error in getting blocks by block number",
                }
            }
        }
    }

    static getBlocksCount = async () => {
        try {
            const count = await Blockchain.getBlocksCount()
            return {
                jsonrpc: "2.0",
                id: md5(String(count)),
                result: count
            }
        } catch (error) {
            return {
                jsonrpc: "2.0",
                id: md5(String(error)),
                error: {
                    code: 400,
                    message: "error in getting blocks count",
                }
            }
        }
    }

    static getBlockTransactions = async (hash: string) => {
        try {
            const transactions = await Blockchain.getBlockTransactions(hash)
            return {
                jsonrpc: "2.0",
                id: md5(String(transactions)),
                result: transactions
            }

        } catch (error) {
            return {
                jsonrpc: "2.0",
                id: md5(String(error)),
                error
            }
        }
    }

    static isChainValid() {
        try {
            const isChainValid = Blockchain.isChainValid()
            if (isChainValid)
                return {
                    jsonrpc: "2.0",
                    id: md5(String(isChainValid)),
                    result: true
                }

            return {
                jsonrpc: "2.0",
                id: md5(String(isChainValid)),
                result: false
            }
        } catch (error) {
            return {
                jsonrpc: "2.0",
                id: md5(error.toString()),
                result: false
            }
        }
    }

    static addBlock = async (): Promise<object> => {
        try {
            const block = await Blockchain.addBlock();

            if (block)
                return {
                    jsonrpc: "2.0",
                    id: md5("block"),
                    result: block
                }

            return {
                jsonrpc: "2.0",
                id: md5("error"),
                error: {
                    code: 400,
                    message: "error in adding block",
                }
            }

        } catch (error) {
            return {
                jsonrpc: "2.0",
                id: md5("error"),
                error: {
                    code: 400,
                    message: "error in adding block",
                }
            }
        }
    }

    static getBlockchainSize = async (): Promise<object> => {
        try {
            const collection_stats = await db.command({ collStats: "blocks" });
            const size = collection_stats.size;

            return {
                jsonrpc: "2.0",
                id: md5("size"),
                result: {
                    size: this.formatSize(size)
                }
            }

        } catch (error) {
            return {
                jsonrpc: "2.0",
                id: md5("error"),
                error: {
                    code: 400,
                    message: "error in getting blockchain size",
                }
            }
        }
    }

    static formatSize = (size_in_bytes: number): string => {
        if (size_in_bytes < 1024) {
            return `${size_in_bytes} B`;
        } else if (size_in_bytes < 1024 * 1024) {
            return `${(size_in_bytes / 1024).toFixed(2)} KB`;
        } else if (size_in_bytes < 1024 * 1024 * 1024) {
            return `${(size_in_bytes / (1024 * 1024)).toFixed(2)} MB`;
        } else if (size_in_bytes < 1024 * 1024 * 1024 * 1024) {
            return `${(size_in_bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
        } else {
            return `${(size_in_bytes / (1024 * 1024 * 1024 * 1024)).toFixed(2)} TB`;
        }
    }

    static getBlockchainInfo = async (): Promise<object> => {
        const pipeline: any[] = [
            {
                '$group': {
                    '_id': null,
                    'total_balance': { '$sum': '$balance' }
                }
            },
            {
                '$project': {
                    '_id': 0,
                    'total_balance': 1
                }
            }
        ];

        try {
            const result = await db.collection("wallets").aggregate(pipeline).toArray();
            const circulating_supply: number = result[0]?.total_balance || 0;

            return {
                jsonrpc: "2.0",
                id: md5("success"),
                result: {
                    "circulating_supply": circulating_supply,
                    "total_suply": circulating_supply,
                    "max_suplay": MAX_SUPPLY,
                }
            };

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

    static getBlocksByHash = async (hash: string) => {
        try {
            const block = await db.collection("blocks").findOne({ hash }, { projection: { _id: 0, _v: 0, signature: 0 } })

            if (block)
                return {
                    jsonrpc: "2.0",
                    id: md5(block.hash),
                    result: block,
                }

            return {
                jsonrpc: "2.0",
                id: md5("error"),
                error: {
                    code: 404,
                    message: "Block not found",
                }
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
}


export default RPCBlockchain