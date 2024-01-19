import { pathsGenerator } from "../helpers"

export default {
    "/": pathsGenerator("get_blockchain_info", "Blockchain", "Returns the current blockchain information."),
    "/ ": pathsGenerator("get_blockchain_size", "Blockchain", "Returns the current blockchain size."),
    "/  ": pathsGenerator("add_block", "Blockchain", "Adds a new block to the blockchain."),
    "/   ": pathsGenerator("is_chain_valid", "Blockchain", "Returns if the blockchain is valid."),
    "/    ": pathsGenerator("get_blocks_count", "Blockchain", "Returns the blocks count."),
    "/     ": pathsGenerator("get_blocks_by_hash", "Blockchain", "Returns the blocks by hash.", { "hash": "f248dfbf7d5f591f9f190fb177a49a7413631747af0ea16b242a1debc9434106" }),
    "/      ": pathsGenerator("get_block_transactions", "Blockchain", "Returns all the transactions in a block.", { "hash": "f248dfbf7d5f591f9f190fb177a49a7413631747af0ea16b242a1debc9434106" }),
    "/       ": pathsGenerator("get_block_by_block_number", "Blockchain", "Returns all the transactions in a block.", { "block_number": 0 }),
}


