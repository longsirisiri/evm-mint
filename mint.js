import config from "./config.js";
import ethers from "ethers";
import fs from 'fs';

async function performTransaction(walletInfo) {
    console.log(`开始Mint: ${walletInfo.address}`)

    const provider = new ethers.providers.JsonRpcProvider(config.RPC_NODE);
    const wallet = new ethers.Wallet(walletInfo.privateKey, provider);

    const transferAmount = ethers.utils.parseEther(config.MINT_TRANSFER_AMOUNT.toString())
    const memoData = '0x' + Buffer.from(config.MINT_MEMO, 'utf8').toString('hex');
    const gasLimit = config.GAS_LIMIT;

    let successCount = 0;
    let attemptCount = 0;

    while (successCount < config.MINT_TIMES) {
        try {
            const currentGasPrice = await wallet.getGasPrice()
            const gasMultiple = parseInt(String(config.GAS_PRICE_MULTIPLY * 100))
            const gasPrice = currentGasPrice.div(100).mul(gasMultiple);

            const transaction = {
                to: wallet.address,
                value: transferAmount,
                gasPrice,
                gasLimit,
                data: memoData
            };

            const tx = await wallet.sendTransaction(transaction);
            console.log(`${wallet.address}, 第 ${successCount + 1} 次操作成功: ${tx.hash}`);

            successCount++;
            if (config.MINT_WAIT > 0)
                await new Promise(resolve => setTimeout(resolve, config.MINT_WAIT));
        } catch (error) {
            console.error(`尝试次数 ${attemptCount + 1} 失败: `, error);
            attemptCount++;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    console.log(`总共尝试次数: ${attemptCount}, 成功次数: ${successCount}`);
}

async function main() {
    let path = config.WALLET_PATH
    let walletData = []
    if (!fs.existsSync(path)) {
        throw new Error('钱包文件不存在')
    }
    walletData = JSON.parse(fs.readFileSync(path, 'utf-8'));
    if (walletData.length === 0) {
        throw new Error('钱包文件内容为空')
    }

    const provider = new ethers.providers.JsonRpcProvider(config.RPC_NODE);
    const mainWallet = new ethers.Wallet(config.PRIVATE_KEY, provider);
    const balance = await provider.getBalance(mainWallet.address)
    const balanceInEther = ethers.utils.formatEther(balance);
    console.log(`主钱包地址: ${mainWallet.address} 余额: ${balanceInEther}`)

    Promise.all(walletData.map(wallet => performTransaction(wallet)))
        .then(() => {
            console.log("所有操作完成");
        })
        .catch(error => {
            console.error("操作中有错误发生: ", error);
        });
}

main()