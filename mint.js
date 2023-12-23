import { ethers } from "ethers";
import fs from 'fs';
import { sendAndWatchTransaction } from './utils.js';

// RPC地址
const RPC_NODE = 'https://goerli.infura.io/v3/52a075204b4c48f2ac2c5bc0f9a5b0f0'
// 钱包存储路径
const WALLET_PATH = './wallets.json'

// 铭文memo
const MINT_MEMO = 'data:,{"p":"injrc-20","op":"mint","tick":"INJS","amt":"1000"}'
// 自转数量, 可以转0
const MINT_TRANSFER_AMOUNT = 0
// Mint次数
const MINT_TIMES = 3
// Mint后等待时间, 单位毫秒
const MINT_WAIT = 1000
// Mint超时时间, 单位秒，超过这个时间还没完成则提高手续费重新提交
const MINT_TIMEOUT = 5

// 交易手续费递增倍数，交易卡住时会自动调高gas费
const GAS_PRICE_INCREASE = 0.2
// 交易手续费递增轮数，交易卡住时会自动调高gas费，超过这个轮数则不再调高
const GAS_MAX_INCREASE_ROUND = 5
// 交易手续费上限
const GAS_LIMIT = 50000

async function performTransaction(walletInfo, provider) {
    const wallet = new ethers.Wallet(walletInfo.privateKey, provider);
    const nonce = await provider.getTransactionCount(wallet.address, 'pending')
    console.log(`开始Mint: ${walletInfo.address} 当前Nonce: ${nonce}`)

    const transferAmount = ethers.parseEther(MINT_TRANSFER_AMOUNT.toString())
    const memoData = '0x' + Buffer.from(MINT_MEMO, 'utf8').toString('hex');
    const gasLimit = GAS_LIMIT;

    const calculateGasPrice = async function (tx, round) {
        if (round >= GAS_MAX_INCREASE_ROUND)
            return null

        round = round > GAS_MAX_INCREASE_ROUND ? GAS_MAX_INCREASE_ROUND : round
        const feeData = await wallet.provider.getFeeData()
        const multiply = 100 + (round + 1) * GAS_PRICE_INCREASE * 100
        const gasPrice = feeData.gasPrice * BigInt(multiply) / 100n

        return ethers.parseUnits(gasPrice.toString(), 'gwei')
    }

    for (let i = 0; i < MINT_TIMES; i++) {
        const txData = {
            to: wallet.address,
            value: transferAmount,
            nonce: nonce + i,
            gasLimit,
            data: memoData
        };

        console.log(`${wallet.address} 第 ${i + 1} 次Mint操作...`)
        await sendAndWatchTransaction(wallet, txData, calculateGasPrice, MINT_TIMEOUT)
        console.log(`${wallet.address} 第 ${i + 1} 次Mint操作完成`)

        if (MINT_WAIT > 0)
            await new Promise(resolve => setTimeout(resolve, MINT_WAIT));
    }

    console.log(`${wallet.address} Mint完成`);
}

async function main() {
    let path = WALLET_PATH
    let walletData = []
    if (!fs.existsSync(path)) {
        throw new Error('钱包文件不存在')
    }
    walletData = JSON.parse(fs.readFileSync(path, 'utf-8'));
    if (walletData.length === 0) {
        throw new Error('钱包文件内容为空')
    }

    const provider = new ethers.JsonRpcProvider(RPC_NODE);
    Promise.all(walletData.map(walletInfo => performTransaction(walletInfo, provider)))
        .then(() => {
            console.log("所有操作完成");
        })
        .catch(error => {
            console.error("操作中有错误发生: ", error);
        });
}

main()