import { pathsGenerator } from "../helpers"

const newTransactionData = {
    "private_key": "d03caa152385dec742bcae228f0bd25755602a88f09b1f0f78fa653b4c7f699d",
    "receiver": "03b40a4bdf6e51490e3ff92c964ed959b6e688777fa64f4c99e7aa619fc4fc1827",
    "amount": 10
}

const transaction = {
    "sender": "03efd29517cbd71885762542100cd506453f031d3e10c48adc3076ee764d574fb1",
    "receiver": "03b40a4bdf6e51490e3ff92c964ed959b6e688777fa64f4c99e7aa619fc4fc1827",
    "amount": 9.9,
    "hash": "53c9b1e40d5ccdeb2983afd21389d263d551002f37fb803092722ea5be6df5a4",
    "timestamp": 1705637182076,
    "status": "pending"
}

export default {
    "/                ": pathsGenerator("get_pending_transactions", "Transactions", "Returns all the pending transactions in the pool."),
    "/                 ": pathsGenerator("create_transaction", "Transactions", "Creates a new transaction.", newTransactionData),
    "/                  ": pathsGenerator("get_transaction_by_hash", "Transactions", "Creates a new transaction.", { "hash": transaction.hash }),
}


