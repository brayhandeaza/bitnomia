export type BlockType = {
    block_number: number
    timestamp: number
    last_hash: string
    hash: string
    transactions: any[]
    validator: string
    signature: string
}

export type TransactionType = {
    sender: string
    receiver: string
    amount: number
    hash: string
    timestamp: number
    signature: string
    status: string
}

export type WalletType = {
    public_key: string
    private_key: string
    balance: number
}
