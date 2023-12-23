import fs from 'fs';
import { ethers } from "ethers";

// 钱包存储路径
const WALLET_PATH = './wallets.json'
// 钱包生成数量
const WALLET_COUNT = 10

async function main() {
    console.log(`生成钱包数量: ${WALLET_COUNT}`)

    let data = [];
    let path = WALLET_PATH
    if (fs.existsSync(path)) {
        const existingData = JSON.parse(fs.readFileSync(path, 'utf8'));
        data = [...existingData];
    }

    for (let i = 0; i < WALLET_COUNT; i++) {
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