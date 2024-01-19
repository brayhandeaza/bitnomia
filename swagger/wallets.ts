import { pathsGenerator } from "../helpers"

const wallets = [
    "03efd29517cbd71885762542100cd506453f031d3e10c48adc3076ee764d574fb1",
    "03b40a4bdf6e51490e3ff92c964ed959b6e688777fa64f4c99e7aa619fc4fc1827"
]

const stake = {
    "private_key": "d03caa152385dec742bcae228f0bd25755602a88f09b1f0f78fa653b4c7f699d",
    "amount": 10.00
}

export default {
    "/        ": pathsGenerator("create_wallet", "Wallets", "Creates a new wallet."),
    "/         ": pathsGenerator("get_wallet_balance", "Wallets", "Returns the wallet balance."),
    "/          ": pathsGenerator("get_wallet_balance_in_batch", "Wallets", "Returns balances in batch", { "wallets": wallets }),
    "/           ": pathsGenerator("get_wallet_transactions", "Wallets", "Returns all the transactions in a wallet.", { "public_key": wallets[0] }),
    "/            ": pathsGenerator("get_wallet_by_private_key", "Wallets", "Gets a wallet info by private key.", { "private_key": "85213fcc895c4b50a62158007a7da4de9bafca5eae890b72e474797e9cbc273c" }),
    "/             ": pathsGenerator("get_wallet_staking_balance", "Wallets", "Returns the wallet staking balance.", { "public_key": wallets[0] }),
    "/              ": pathsGenerator("stake", "Wallets", "Stake your balance.", stake),
    "/               ": pathsGenerator("unstake", "Wallets", "Unstake your balance.", stake),
}


