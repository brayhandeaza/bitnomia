import Utils from "../utils";


class Transactions {

	sender: string;
	receiver: string;
	amount: number;
	hash: string;
	timestamp: number;
	signature: string;

	constructor(sender: string, receiver: string, amount: number) {
		this.sender = sender;
		this.receiver = receiver;
		this.amount = amount;
		this.timestamp = Date.now()
		this.hash = Utils.hash(JSON.stringify({ sender, receiver, amount, timestamp: this.timestamp }));
		this.signature = '';
	}

	toJSON(): any {
		return {
			"sender": this.sender,
			"receiver": this.receiver,
			"amount": this.amount,
			"hash": this.hash,
			"timestamp": this.timestamp,
			"signature": this.signature,
			"status": "pending"
		};
	}

	sign(signature: string): void {
		this.signature = signature;
	}
}


export default Transactions