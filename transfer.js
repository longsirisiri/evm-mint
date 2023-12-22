import config from "./config.js";
import fs from 'fs';
import ethers from "ethers";

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(config.RPC_NODE);
    const mainWallet = new ethers.Wallet(config.PRIVATE_KEY, provider);
    const balance = await provider.getBalance(mainWallet.address)
    const balanceInEther = ethers.utils.formatEther(balance);
    console.log(`主钱包地址: ${mainWallet.address} 余额: ${balanceInEther}`)

    let path = config.WALLET_PATH
    if (!fs.existsSync(path))
        throw new Error('钱包文件不存在')

    const wallets = JSON.parse(fs.readFileSync(path, 'utf8'));
    const recipients = wallets.map(wallet => wallet.address);
    for (const recipient of recipients) {
        console.log(`转账给 ${recipient} ${config.TRANSFER_AMOUNT}`)
        try {
            const amount = ethers.utils.parseEther(config.TRANSFER_AMOUNT.toString())

            const currentGasPrice = await wallet.getGasPrice()
            const gasMultiple = parseInt(String(config.GAS_PRICE_MULTIPLY * 100))
            const gasPrice = currentGasPrice.div(100).mul(gasMultiple);
            const gasLimit = config.GAS_LIMIT;

            const transaction = {
                to: recipient,
                value: amount,
                gasPrice,
                gasLimit,
            }
            const tx = await mainWallet.sendTransaction(transaction);
            console.log(`${recipient}: 转账 ${config.TRANSFER_AMOUNT} 成功: ${tx.hash}`);
        } catch (error) {
            console.error(`转账给 ${recipient} 失败: `, error);
        }
    }
}

main()