import { MONGODB_DATABASE, MONGODB_URL } from '../constants';
import { MongoClient } from "mongodb"


const client = new MongoClient(MONGODB_URL)
const db = client.db(MONGODB_DATABASE)

export {
    db,
    client
}