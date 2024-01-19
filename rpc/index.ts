import { JSONRPCServer, createJSONRPCErrorResponse } from "json-rpc-2.0"
import RPCWallets from "./wallets";
import RPCBlockchain from "./blockchain";
import RPCTransactions from "./transactions";
import Transactions from "../transactions";



const server = new JSONRPCServer();

type JsonRpcRequest = {
    jsonrpc: '2.0';
    method: string;
    params?: any;
    id: number;
}


const methodsHandlerMiddleware = (next: Function, request: JsonRpcRequest, serverParams: any) => {
    return next(request, serverParams).then(async () => {
        const private_key = request.params?.private_key
        const public_key = request.params?.public_key
        const receiver = request.params?.receiver
        const amount = request.params?.amount
        const hash = request.params?.hash
        const wallets = request.params?.wallets

        switch (request.method) {
            // Blockchain
            case "test":
                const transactions = new Transactions("test", "test", 1000)
                return transactions.toJSON()

            case "get_blockchain_info":
                return RPCBlockchain.getBlockchainInfo()

            case "get_blockchain_size":
                return RPCBlockchain.getBlockchainSize()

            case "get_blocks_by_hash":
                return RPCBlockchain.getBlocksByHash(request.params.hash)

            case "add_block":
                return RPCBlockchain.addBlock()

            case "is_chain_valid":
                return RPCBlockchain.isChainValid()

            case "get_block_transactions":
                return RPCBlockchain.getBlockTransactions(hash)

            case "get_block_by_block_number":
                const { block_number } = request.params
                return RPCBlockchain.getBlockByBlockNumber(block_number)

            case "get_blocks_count":
                return RPCBlockchain.getBlocksCount()

            // Transactions 
            case "create_transaction":
                return RPCTransactions.createTransaction(private_key, receiver, amount)

            case "get_pending_transactions":
                return RPCTransactions.getPendingTransactions()

            case "get_transaction_by_hash":
                return RPCTransactions.getTransactionByHash(hash)

            // Wallets
            case "create_wallet":
                return RPCWallets.createWallet()

            case "get_wallet_balance_in_batch":                
                return RPCWallets.getWalletBalanceInBatch(wallets)

            case "get_wallet_balance":
                return RPCWallets.getWalletBalance(public_key)

            case "get_wallet_staking_balance":
                return RPCWallets.getWalletStakingBalance(public_key)

            case "get_wallet_transactions":
                return RPCWallets.getWalletTransactions(public_key)

            case "get_wallet_by_private_key":
                return RPCWallets.getWalletByPrivateKey(private_key)

            case "stake":
                return RPCWallets.stake(private_key, amount)

            case "unstake":
                return RPCWallets.unstake(private_key, amount)

            default:
                break
        }
    })
}

const exceptionMiddleware = async (next: Function, request: JsonRpcRequest, serverParams: any) => {
    try {
        return await next(request, serverParams)

    } catch (error) {
        if (error.code)
            return createJSONRPCErrorResponse(request.id, error.code, error.message);
        throw error;
    }
}


server.applyMiddleware(methodsHandlerMiddleware, exceptionMiddleware)

export default server