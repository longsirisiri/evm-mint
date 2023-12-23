import fs from 'fs';
import { ethers } from "ethers";

// 主钱包私钥
const PRIVATE_KEY = ''
// RPC地址
const RPC_NODE = 'https://goerli.infura.io/v3/'
// 钱包存储路径
const WALLET_PATH = './wallets.json'
// 发送原生代币数量
const TRANSFER_AMOUNT = 0.001
// 交易手续费倍数
const GAS_PRICE_MULTIPLY = 1.5
// 交易手续费上限
const GAS_LIMIT = 50000

async function main() {
    const provider = new ethers.JsonRpcProvider(RPC_NODE);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const balance = await provider.getBalance(wallet.address)
    const balanceInEther = ethers.formatEther(balance);
    console.log(`主钱包地址: ${wallet.address} 余额: ${balanceInEther}`)

    let path = WALLET_PATH
    if (!fs.existsSync(path))
        throw new Error('钱包文件不存在')

    const wallets = JSON.parse(fs.readFileSync(path, 'utf8'));
    const recipients = wallets.map(wallet => wallet.address);
    for (const recipient of recipients) {
        console.log(`转账给 ${recipient} ${TRANSFER_AMOUNT}`)
        try {
            const amount = ethers.parseEther(TRANSFER_AMOUNT.toString())

            const feeData = await wallet.provider.getFeeData()
            const currentGasPrice = ethers.parseUnits(feeData.gasPrice.toString(), 'gwei')
            const gasMultiple = BigInt(parseInt(String(GAS_PRICE_MULTIPLY * 100)))
            const gasPrice = currentGasPrice * gasMultiple / 100n
            const gasLimit = GAS_LIMIT;

            const transaction = {
                to: recipient,
                value: amount,
                gasPrice,
                gasLimit,
            }

            const tx = await wallet.sendTransaction(transaction);
            console.log(`${recipient}: 转账 ${TRANSFER_AMOUNT} 成功: ${tx.hash}`);
        } catch (error) {
            console.error(`转账给 ${recipient} 失败: `, error);
        }
    }
}

main()