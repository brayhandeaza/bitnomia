export type BlockType = {
    block_number: number,
    timestamp: number,
    last_hash: string,
    hash: string,
    transactions: any[],
    validator: string,
    signature: string
}