import config from "./config.js";
import fs from 'fs';
import ethers from "ethers";

async function main() {
    console.log(`生成钱包数量: ${config.WALLET_COUNT}`)

    let data = [];
    let path = config.WALLET_PATH
    if (fs.existsSync(path)) {
        const existingData = JSON.parse(fs.readFileSync(path, 'utf8'));
        data = [...existingData];
    }

    for (let i = 0; i < config.WALLET_COUNT; i++) {
        const wallet = ethers.Wallet.createRandom();
        data.push({
            address: wallet.address,
            mnemonic: wallet.mnemonic.phrase,
            privateKey: wallet.privateKey
        });
    }

    fs.writeFileSync(path, JSON.stringify(data, null, 4));
}

main()