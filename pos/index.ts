import { BITNOMIA_WALLET_PUBLIC_KEY } from "../constants";
import { db } from "../db";
import Utils from "../utils";
import Lot from "./lot";


class PoS {
    validator_lots = async (seed: string): Promise<Lot[]> => {
        const lots: Lot[] = [];
        const stakers = await db.collection("stakers").find({}).limit(1000).toArray();
        console.log(stakers);


        for (const staker of stakers) {
            lots.push(new Lot(staker.public_key, staker.balance, seed));
        }

        return lots;
    }

    private winner_lots = (lots: Lot[], seed: string): Lot => {
        let winner_lots: Lot;
        let least_offset: number;
        const reference_hash_int_value = parseInt(Utils.hash(seed), 16);

        lots.forEach(lot => {
            const lot_int_value = parseInt(lot.lotHash(), 16);
            const offset = Math.abs(lot_int_value - reference_hash_int_value);

            if (least_offset === null || offset < least_offset) {
                least_offset = offset;
                winner_lots = lot;
            }
        })

        return winner_lots;
    }


    get_random_string = (length: number): string => {
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        let result_string = '';

        for (let i = 0; i < length; i++) {
            result_string += letters.charAt(Math.floor(Math.random() * letters.length));
        }

        return result_string;
    }

    validator = async (): Promise<string> => {
        const last_block = await db.collection("blocks").find({}).sort({ block_number: -1 }).limit(1).next();

        if (last_block) {
            const hash = Math.floor(Math.random() * String(last_block.hash).length * 2);
            const last_block_hash = this.get_random_string(hash || 1);
            const lots = await this.validator_lots(last_block_hash);

            if (lots.length > 0) {
                return BITNOMIA_WALLET_PUBLIC_KEY.toString();
            }

            const winner_lots = this.winner_lots(lots, last_block_hash);

            if (winner_lots) {
                return winner_lots.public_key;
            }
        }

        return BITNOMIA_WALLET_PUBLIC_KEY.toString();
    }

}

export default PoS