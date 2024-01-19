import elliptic from 'elliptic';
import Utils from '../utils';


const EC = elliptic.ec;
const ec = new EC('secp256k1');

class Wallets {
    publicKey: string;
    privateKey: string;

    constructor() {
        const keyPair = ec.genKeyPair();
        const publicKeyCompressed = keyPair.getPublic('hex', 'compressed');
        const privateKeyHex = keyPair.getPrivate('hex');

        this.publicKey = Utils.hash(publicKeyCompressed);
        this.privateKey = privateKeyHex;
    }

    static createWallet() {
        return new Wallets().toJSON()
    }

    toJSON() {
        return {
            public_key: this.publicKey,
            private_key: this.privateKey,
            balance: 0
        }
    }

    static sign(data: string, privateKey: string) {
        const key = ec.keyFromPrivate(privateKey, 'hex');
        const signature = key.sign(data, { canonical: true });
        return signature.toDER('hex');
    }

    static verify = (message: string, signature: string, privateKey: string) => {
        const keyPair = ec.keyFromPrivate(privateKey, 'hex');
        const publicKeyCompressed = keyPair.getPublic('hex', 'compressed');

        const key = ec.keyFromPublic(publicKeyCompressed, 'hex');
        const verified = key.verify(message, signature);

        return verified
    }

    static recoverPublicKeyFromPrivateKey = (privateKey) => {
        const keyPair = ec.keyFromPrivate(privateKey, 'hex');
        const publicKeyCompressed = keyPair.getPublic('hex', 'compressed');
        return Utils.hash(publicKeyCompressed);
    }
}

export default Wallets
