import { DYNAMIC_DECIMAL } from "../helpers";
import { WalletType } from "../helpers/types";

const MONGODB_USERNAME: string = process.env.MONGO_INITDB_ROOT_USERNAME;
const MONGODB_PASSWORD: string = process.env.MONGO_INITDB_ROOT_PASSWORD;
const MONGODB_DATABASE: string = process.env.MONGO_INITDB_ROOT_DATABASE;
const MONGODB_PORT: number = Number(process.env.ME_CONFIG_MONGODB_PORT);
const MONGODB_HOST: string = process.env.ME_CONFIG_MONGODB_HOST;
const MONGODB_URL: string = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOST}`;
// mongodb+srv://brayhandeaza:<password>@cluster0.n9jebes.mongodb.net/?retryWrites=true&w=majority
// General
const INITIAL_MARKET_CAP: number = 1e7;
const INITIAL_SUPPLY: number = 10e9;
const MAX_SUPPLY: number = 50e9;
const VALIDATING_REWARD: number = 5;
const TRANSACTION_FEE_PERCENTAGE: number = 0.01;


// Bitnomia
const BITNOMIA_LOCAL_HOST: string = process.env.BITNOMIA_LOCAL_HOST;

const WALLET_PUBLIC_KEY: string = process.env.WALLET_PUBLIC_KEY;
const WALLET_PRIVATE_KEY: string = process.env.WALLET_PRIVATE_KEY;

const BITNOMIA_WALLET_PUBLIC_KEY: string = process.env.BITNOMIA_WALLET_PUBLIC_KEY;
const BITNOMIA_WALLET_PRIVATE_KEY: string = process.env.BITNOMIA_WALLET_PRIVATE_KEY;

const STAKE_WALLET_PRIVATE_KEY: string = process.env.STAKE_WALLET_PRIVATE_KEY;
const STAKE_WALLET_PUBLIC_KEY: string = process.env.STAKE_WALLET_PUBLIC_KEY;

const LOST_WALLET_PUBLIC_KEY: string = process.env.LOST_WALLET_PUBLIC_KEY;
const LOST_WALLET_PRIVATE_KEY: string = process.env.LOST_WALLET_PRIVATE_KEY;


const GENESIS_WALLETS: WalletType[] = [
    {
        public_key: BITNOMIA_WALLET_PUBLIC_KEY,
        private_key: BITNOMIA_WALLET_PRIVATE_KEY,
        balance: DYNAMIC_DECIMAL(INITIAL_SUPPLY)
    },
    {
        public_key: STAKE_WALLET_PUBLIC_KEY,
        private_key: STAKE_WALLET_PRIVATE_KEY,
        balance: 0
    },
    {
        public_key: LOST_WALLET_PUBLIC_KEY,
        private_key: LOST_WALLET_PRIVATE_KEY,
        balance: 0
    },
    {
        public_key: WALLET_PUBLIC_KEY,
        private_key: WALLET_PRIVATE_KEY,
        balance: 0
    }
]

export {
    MONGODB_URL,
    INITIAL_MARKET_CAP,
    INITIAL_SUPPLY,
    MAX_SUPPLY,
    VALIDATING_REWARD,
    TRANSACTION_FEE_PERCENTAGE,
    BITNOMIA_LOCAL_HOST,
    BITNOMIA_WALLET_PUBLIC_KEY,
    BITNOMIA_WALLET_PRIVATE_KEY,
    STAKE_WALLET_PRIVATE_KEY,
    STAKE_WALLET_PUBLIC_KEY,
    LOST_WALLET_PUBLIC_KEY,
    LOST_WALLET_PRIVATE_KEY,
    WALLET_PUBLIC_KEY,
    WALLET_PRIVATE_KEY,
    MONGODB_DATABASE,
    MONGODB_PORT,
    MONGODB_HOST,
    GENESIS_WALLETS
}