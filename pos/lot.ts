import Utils from '../utils';

class Lot {
    public_key: string;
    iterations: number;
    last_block_hash: string;

    constructor(public_key: any, iterations: any, last_block_hash: any) {
        this.public_key = String(public_key);
        this.iterations = Number(iterations);
        this.last_block_hash = String(last_block_hash);
    }

    lotHash(): string {
        let data_hash = this.public_key + this.last_block_hash;

        for (let _ = 0; _ < this.iterations; _++) {
            data_hash = Utils.hash(data_hash);
        }

        return data_hash;
    }
}


export default Lot