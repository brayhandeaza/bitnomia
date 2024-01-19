import crypto from 'crypto';

class Utils {
    static hash(data = "") {
        const hash = crypto.createHash('sha256');
        hash.update(data);
        return hash.digest('hex');
    }
}

export default Utils
