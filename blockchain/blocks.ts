import { BITNOMIA_WALLET_PRIVATE_KEY, BITNOMIA_WALLET_PUBLIC_KEY } from "../constants";
import { db } from "../db";
import { BlockType } from "../helpers/types";
import Utils from "../utils"
import Wallets from "../wallets"

class Block {
    block_number: number;
    timestamp: number;
    last_hash: string;
    hash: string;
    transactions: any[];
    validator: string;
    signature: string;

    constructor(block_number: number, timestamp: number, last_hash: string, hash: string, transactions: any[], validator: string) {
        this.block_number = block_number;
        this.timestamp = timestamp;
        this.last_hash = last_hash;
        this.hash = hash;
        this.transactions = transactions;
        this.validator = validator;
        this.signature = '';
    }

    toJSON(): BlockType {
        return {
            "block_number": this.block_number,
            "timestamp": this.timestamp,
            "last_hash": this.last_hash,
            "hash": this.hash,
            "transactions": this.transactions,
            "validator": this.validator,
            "signature": this.signature,
        };
    }

    static genesis(): BlockType {
        const timestamp = Date.now();
        const last_hash = Utils.hash('genesis');
        const hash = Utils.hash(JSON.stringify({
            "block_number": 0,
            "timestamp": timestamp,
            "last_hash": last_hash,
            "transactions": [],
            "validator": BITNOMIA_WALLET_PUBLIC_KEY,
        }));

        const block = new Block(
            0,
            timestamp,
            last_hash,
            hash,
            [],
            BITNOMIA_WALLET_PUBLIC_KEY
        );

        const signature = Wallets.sign(BITNOMIA_WALLET_PRIVATE_KEY, hash);
        block.sign(signature);

        return block.toJSON()
    }

    static createBlock = async (validator: string, transactions: any[] = [], _blockNumber: number = null) => {
        try {
            const lastBlock = await db.collection("blocks").find({}).sort({ block_number: -1 }).limit(1).next()

            if (lastBlock) {
                const block_number = _blockNumber || lastBlock.block_number + 1
                const timestamp = Date.now()
                const last_hash = lastBlock.hash || Utils.hash('genesis');

                const hash = Utils.hash(JSON.stringify({
                    "timestamp": timestamp,
                    "last_hash": last_hash,
                    "transactions": transactions,
                    "validator": validator,
                }));

                const block = new Block(
                    block_number,
                    timestamp,
                    last_hash,
                    hash,
                    transactions,
                    validator
                );

                const validator_wallet = await db.collection("wallets").findOne({ public_key: validator })
                const validator_private_key = validator_wallet ? validator_wallet.private_key : BITNOMIA_WALLET_PRIVATE_KEY;

                const signature = Wallets.sign(validator_private_key, hash);
                block.sign(signature);

                return block.toJSON()
            }

            return false;

        } catch (error) {
            console.log(error)
            return false
        }
    }


    sign(signature: string): void {
        this.signature = signature;
    }
}


export default Block